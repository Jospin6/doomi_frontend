import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all fulfillments (can be filtered by orderId, warehouseId, or status)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('orderId');
  const warehouseId = searchParams.get('warehouseId');
  const status = searchParams.get('status');

  try {
    const where: any = {};
    if (orderId) where.orderId = orderId;
    if (warehouseId) where.warehouseId = warehouseId;
    if (status) where.status = status;

    const fulfillments = await prisma.fulfillment.findMany({
      where,
      include: {
        order: { select: { id: true } },
        warehouse: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(fulfillments);
  } catch (error) {
    console.error('Error fetching fulfillments:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST a new fulfillment
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, warehouseId, notes } = body;

    if (!orderId || !warehouseId) {
      return NextResponse.json({ error: 'orderId and warehouseId are required' }, { status: 400 });
    }

    const newFulfillment = await prisma.fulfillment.create({
      data: {
        orderId,
        warehouseId,
        status: 'PENDING',
        notes,
      },
    });

    return NextResponse.json(newFulfillment, { status: 201 });
  } catch (error) {
    console.error('Error creating fulfillment:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Order or Warehouse not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
