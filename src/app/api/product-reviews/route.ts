import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all product reviews (can be filtered by productId or userId)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');
  const userId = searchParams.get('userId');

  try {
    const where: any = {};
    if (productId) where.productId = productId;
    if (userId) where.userId = userId;

    const productReviews = await prisma.productReview.findMany({
      where,
      include: {
        user: { select: { firstName: true, lastName: true } },
        product: { select: { name: true } },
        replies: true,
      },
      orderBy: { reviewDate: 'desc' },
    });
    return NextResponse.json(productReviews);
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST a new product review
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, userId, orderId, rating, comment } = body;

    if (!productId || !userId || rating === undefined) {
      return NextResponse.json({ error: 'productId, userId, and rating are required' }, { status: 400 });
    }

    const newProductReview = await prisma.productReview.create({
      data: {
        productId,
        userId,
        orderId,
        rating,
        comment,
        isApproved: false, // Reviews may need approval
      },
    });

    return NextResponse.json(newProductReview, { status: 201 });
  } catch (error) {
    console.error('Error creating product review:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Product, User, or Order not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
