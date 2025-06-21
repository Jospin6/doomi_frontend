import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Params {
  params: { id: string };
}

// GET a single promotion by ID
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const promotion = await prisma.promotion.findUnique({
      where: { id },
      include: { uses: { select: { id: true, userId: true, usedAt: true } } },
    });

    if (!promotion) {
      return NextResponse.json({ error: 'Promotion not found' }, { status: 404 });
    }

    return NextResponse.json(promotion);
  } catch (error) {
    console.error('Error fetching promotion:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT (update) a promotion by ID
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const body = await request.json();
    const { 
        description, 
        discountType, 
        discountValue, 
        startDate, 
        endDate, 
        minPurchase, 
        maxUses, 
        isActive 
    } = body;

    const updatedPromotion = await prisma.promotion.update({
      where: { id },
      data: {
        description,
        discountType,
        discountValue,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        minPurchase,
        maxUses,
        isActive,
      },
    });

    return NextResponse.json(updatedPromotion);
  } catch (error) {
    console.error('Error updating promotion:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Promotion not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE a promotion by ID
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = params;
    await prisma.promotion.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error('Error deleting promotion:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Promotion not found' }, { status: 404 });
    }
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2003') {
        return NextResponse.json({ error: 'Cannot delete promotion. It has already been used.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
