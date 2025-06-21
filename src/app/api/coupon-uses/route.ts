import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all coupon uses (can be filtered by promotionId or userId)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const promotionId = searchParams.get('promotionId');
  const userId = searchParams.get('userId');

  try {
    const where: any = {};
    if (promotionId) where.promotionId = promotionId;
    if (userId) where.userId = userId;

    const couponUses = await prisma.couponUse.findMany({
      where,
      include: {
        promotion: { select: { code: true } },
        user: { select: { firstName: true, lastName: true } },
      },
      orderBy: { usedAt: 'desc' },
    });
    return NextResponse.json(couponUses);
  } catch (error) {
    console.error('Error fetching coupon uses:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST a new coupon use
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { promotionId, userId, orderId } = body;

    if (!promotionId || !userId || !orderId) {
      return NextResponse.json({ error: 'promotionId, userId, and orderId are required' }, { status: 400 });
    }

    // In a real app, you should add logic here to verify:
    // 1. The promotion is active and valid.
    // 2. The user has not exceeded the usage limit for this promotion.
    // 3. The order meets the minimum purchase requirement.

    const newCouponUse = await prisma.couponUse.create({
      data: {
        promotionId,
        userId,
        orderId,
      },
    });

    return NextResponse.json(newCouponUse, { status: 201 });
  } catch (error) {
    console.error('Error creating coupon use:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Promotion, User, or Order not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
