import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all orders (can be filtered by userId or status)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const status = searchParams.get('status');

  try {
    const where: any = {};
    if (userId) where.userId = userId;
    if (status) where.status = status as any; // Cast to any to match enum type

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        items: true,
      },
      orderBy: { orderDate: 'desc' },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST a new order
// In a real app, this would be a transaction that also creates OrderItems
// and calculates the total amount on the server.
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
        userId, 
        totalAmount, 
        discountAmount, 
        shippingAmount, 
        finalAmount, 
        shippingAddress, 
        billingAddress, 
        notes, 
        shippingMethod 
    } = body;

    if (!userId || finalAmount === undefined || !shippingAddress) {
      return NextResponse.json({ error: 'Missing required fields: userId, finalAmount, shippingAddress' }, { status: 400 });
    }

    const newOrder = await prisma.order.create({
      data: {
        userId,
        status: 'PENDING', // Default status for a new order
        totalAmount,
        discountAmount,
        shippingAmount,
        finalAmount,
        shippingAddress,
        billingAddress,
        notes,
        shippingMethod,
      },
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
