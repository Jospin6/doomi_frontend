import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all order items (must be filtered by orderId)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('orderId');

  if (!orderId) {
    return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
  }

  try {
    const orderItems = await prisma.orderItem.findMany({
      where: { orderId },
      include: { product: true, variant: true },
    });
    return NextResponse.json(orderItems);
  } catch (error) {
    console.error('Error fetching order items:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST a new order item
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, productId, variantId, quantity, unitPrice, discount } = body;

    if (!orderId || !productId || !quantity || unitPrice === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const totalPrice = (unitPrice * quantity) * (1 - (discount || 0));

    const newOrderItem = await prisma.orderItem.create({
      data: {
        orderId,
        productId,
        variantId,
        quantity,
        unitPrice,
        discount,
        totalPrice,
      },
    });
    
    // You would also need to update the total amount on the parent Order here

    return NextResponse.json(newOrderItem, { status: 201 });
  } catch (error) {
    console.error('Error creating order item:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Order or Product not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
