import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all promotions (can be filtered by isActive)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const isActive = searchParams.get('isActive');

  try {
    const where: any = {};
    if (isActive !== null) where.isActive = isActive === 'true';

    const promotions = await prisma.promotion.findMany({
      where,
      orderBy: { startDate: 'desc' },
    });
    return NextResponse.json(promotions);
  } catch (error) {
    console.error('Error fetching promotions:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST a new promotion
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
        code, 
        description, 
        discountType, 
        discountValue, 
        startDate, 
        endDate, 
        minPurchase, 
        maxUses, 
        isActive 
    } = body;

    if (!code || !discountType || discountValue === undefined) {
      return NextResponse.json({ error: 'code, discountType, and discountValue are required' }, { status: 400 });
    }

    const newPromotion = await prisma.promotion.create({
      data: {
        code,
        description,
        discountType,
        discountValue,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        minPurchase,
        maxUses,
        isActive,
      },
    });

    return NextResponse.json(newPromotion, { status: 201 });
  } catch (error) {
    console.error('Error creating promotion:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2002') {
        return NextResponse.json({ error: 'A promotion with this code already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
