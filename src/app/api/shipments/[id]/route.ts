import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Params {
  params: { id: string };
}

// GET a single shipment by ID
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const shipment = await prisma.shipment.findUnique({
      where: { id },
      include: {
        order: true,
        warehouse: true,
        items: { include: { orderItem: { include: { product: true, variant: true } } } },
      },
    });

    if (!shipment) {
      return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });
    }

    return NextResponse.json(shipment);
  } catch (error) {
    console.error('Error fetching shipment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT (update) a shipment by ID
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const body = await request.json();
    const { trackingNumber, status } = body;

    const updatedShipment = await prisma.shipment.update({
      where: { id },
      data: {
        trackingNumber,
        status,
      },
    });

    return NextResponse.json(updatedShipment);
  } catch (error) {
    console.error('Error updating shipment:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE a shipment by ID
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = params;

    // Deleting a shipment might require reverting inventory levels, which should be handled in a transaction.
    await prisma.shipment.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error('Error deleting shipment:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
