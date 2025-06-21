import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all order status history entries (must be filtered by orderId)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('orderId');

  if (!orderId) {
    return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
  }

  try {
    const history = await prisma.orderStatusHistory.findMany({
      where: { orderId },
      include: { changedBy: { select: { id: true, firstName: true, lastName: true } } },
      orderBy: { changedAt: 'asc' },
    });
    return NextResponse.json(history);
  } catch (error) {
    console.error('Error fetching order status history:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST a new order status history entry
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, oldStatus, newStatus, changedById, notes } = body;

    if (!orderId || !newStatus) {
      return NextResponse.json({ error: 'Order ID and new status are required' }, { status: 400 });
    }

    const newHistoryEntry = await prisma.orderStatusHistory.create({
      data: {
        orderId,
        oldStatus,
        newStatus,
        changedById,
        notes,
      },
    });

    return NextResponse.json(newHistoryEntry, { status: 201 });
  } catch (error) {
    console.error('Error creating order status history:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Order or User not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
