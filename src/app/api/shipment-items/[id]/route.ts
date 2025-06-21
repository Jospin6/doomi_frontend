import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Params {
  params: { id: string };
}

// GET a single shipment item by ID
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const shipmentItem = await prisma.shipmentItem.findUnique({
      where: { id },
      include: {
        shipment: true,
        orderItem: { include: { product: true, variant: true } },
      },
    });

    if (!shipmentItem) {
      return NextResponse.json({ error: 'Shipment item not found' }, { status: 404 });
    }

    return NextResponse.json(shipmentItem);
  } catch (error) {
    console.error('Error fetching shipment item:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT (update) a shipment item by ID
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const body = await request.json();
    const { quantity } = body;

    if (quantity === undefined) {
        return NextResponse.json({ error: 'Quantity is required for an update' }, { status: 400 });
    }

    const updatedShipmentItem = await prisma.shipmentItem.update({
      where: { id },
      data: {
        quantity,
      },
    });

    return NextResponse.json(updatedShipmentItem);
  } catch (error) {
    console.error('Error updating shipment item:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Shipment item not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE a shipment item by ID
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = params;
    await prisma.shipmentItem.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error('Error deleting shipment item:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Shipment item not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
