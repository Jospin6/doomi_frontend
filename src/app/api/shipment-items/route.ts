import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all shipment items (must be filtered by shipmentId)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const shipmentId = searchParams.get('shipmentId');

  if (!shipmentId) {
    return NextResponse.json({ error: 'Shipment ID is required' }, { status: 400 });
  }

  try {
    const shipmentItems = await prisma.shipmentItem.findMany({
      where: { shipmentId },
      include: {
        orderItem: { include: { product: true, variant: true } },
      },
    });
    return NextResponse.json(shipmentItems);
  } catch (error) {
    console.error('Error fetching shipment items:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST a new shipment item (less common, as it's usually done in a transaction with the shipment)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { shipmentId, orderItemId, quantity } = body;

    if (!shipmentId || !orderItemId || quantity === undefined) {
      return NextResponse.json({ error: 'shipmentId, orderItemId, and quantity are required' }, { status: 400 });
    }

    const newShipmentItem = await prisma.shipmentItem.create({
      data: {
        shipmentId,
        orderItemId,
        quantity,
      },
    });

    return NextResponse.json(newShipmentItem, { status: 201 });
  } catch (error) {
    console.error('Error creating shipment item:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Shipment or Order Item not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
