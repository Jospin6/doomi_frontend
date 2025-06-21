import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all payments (can be filtered by orderId)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('orderId');

  try {
    const where: any = {};
    if (orderId) where.orderId = orderId;

    const payments = await prisma.payment.findMany({
      where,
      include: { order: { select: { id: true, finalAmount: true } } },
      orderBy: { paymentDate: 'desc' },
    });
    return NextResponse.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST a new payment
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
        orderId, 
        amount, 
        method, 
        paymentReference, 
        mobileMoneyProvider, 
        mobileMoneyNumber, 
        cardDetails 
    } = body;

    if (!orderId || !amount || !method) {
      return NextResponse.json({ error: 'orderId, amount, and method are required' }, { status: 400 });
    }

    const newPayment = await prisma.payment.create({
      data: {
        orderId,
        amount,
        method,
        status: 'PENDING', // Default status
        paymentDate: new Date(),
        paymentReference,
        mobileMoneyProvider,
        mobileMoneyNumber,
        cardDetails, // In a real app, this should be handled securely and not stored directly
      },
    });

    // You might want to update the order status here as well

    return NextResponse.json(newPayment, { status: 201 });
  } catch (error) {
    console.error('Error creating payment:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
