import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Params {
  params: { id: string };
}

// GET a single coupon use by ID
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const couponUse = await prisma.couponUse.findUnique({
      where: { id },
      include: {
        promotion: true,
        user: { select: { id: true, firstName: true, lastName: true } },
        order: { select: { id: true, finalAmount: true } },
      },
    });

    if (!couponUse) {
      return NextResponse.json({ error: 'Coupon use not found' }, { status: 404 });
    }

    return NextResponse.json(couponUse);
  } catch (error) {
    console.error('Error fetching coupon use:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Note: PUT and DELETE are intentionally omitted for this model
// as coupon usage records are typically immutable.
