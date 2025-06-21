import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all shipments (can be filtered by orderId or warehouseId)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('orderId');
  const warehouseId = searchParams.get('warehouseId');

  try {
    const where: any = {};
    if (orderId) where.orderId = orderId;
    if (warehouseId) where.warehouseId = warehouseId;

    const shipments = await prisma.shipment.findMany({
      where,
      include: {
        order: { select: { id: true } },
        warehouse: { select: { name: true } },
        items: true,
      },
      orderBy: { shippedAt: 'desc' },
    });
    return NextResponse.json(shipments);
  } catch (error) {
    console.error('Error fetching shipments:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST a new shipment with its items
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, warehouseId, trackingNumber, items } = body;

    if (!orderId || !warehouseId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'orderId, warehouseId, and a non-empty array of items are required' }, { status: 400 });
    }

    // Create shipment and shipment items in a transaction
    const newShipment = await prisma.$transaction(async (tx: any) => {
      const shipment = await tx.shipment.create({
        data: {
          orderId,
          warehouseId,
          trackingNumber,
          status: 'PENDING',
        },
      });

      const shipmentItemsData = items.map((item: { orderItemId: string; quantity: number }) => ({
        shipmentId: shipment.id,
        orderItemId: item.orderItemId,
        quantity: item.quantity,
      }));

      await tx.shipmentItem.createMany({
        data: shipmentItemsData,
      });

      // Here you would typically adjust inventory levels as well

      return shipment;
    });

    return NextResponse.json(newShipment, { status: 201 });
  } catch (error) {
    console.error('Error creating shipment:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Related record (Order, Warehouse, OrderItem) not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
