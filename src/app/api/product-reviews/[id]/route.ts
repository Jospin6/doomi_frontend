import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Params {
  params: { id: string };
}

// GET a single product review by ID
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const productReview = await prisma.productReview.findUnique({
      where: { id },
      include: {
        user: { select: { firstName: true, lastName: true } },
        replies: { include: { user: { select: { firstName: true, lastName: true } } } },
      },
    });

    if (!productReview) {
      return NextResponse.json({ error: 'Product review not found' }, { status: 404 });
    }

    return NextResponse.json(productReview);
  } catch (error) {
    console.error('Error fetching product review:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT (update) a product review by ID (e.g., to approve it)
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const body = await request.json();
    const { rating, comment, isApproved } = body;

    const updatedProductReview = await prisma.productReview.update({
      where: { id },
      data: {
        rating,
        comment,
        isApproved,
      },
    });

    return NextResponse.json(updatedProductReview);
  } catch (error) {
    console.error('Error updating product review:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Product review not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE a product review by ID
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = params;
    await prisma.productReview.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error('Error deleting product review:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Product review not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
