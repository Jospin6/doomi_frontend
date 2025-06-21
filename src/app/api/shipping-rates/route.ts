import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all shipping rates (can be filtered by zoneId or methodId)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const zoneId = searchParams.get('zoneId');
  const methodId = searchParams.get('methodId');

  try {
    const where: any = {};
    if (zoneId) where.zoneId = zoneId;
    if (methodId) where.methodId = methodId;

    const shippingRates = await prisma.shippingRate.findMany({
      where,
      include: {
        zone: true,
        method: true,
      },
    });
    return NextResponse.json(shippingRates);
  } catch (error) {
    console.error('Error fetching shipping rates:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST a new shipping rate
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { zoneId, methodId, minWeight, maxWeight, rate, isFlatRate } = body;

    if (!zoneId || !methodId || rate === undefined) {
      return NextResponse.json({ error: 'zoneId, methodId, and rate are required' }, { status: 400 });
    }

    const newShippingRate = await prisma.shippingRate.create({
      data: {
        zoneId,
        methodId,
        minWeight,
        maxWeight,
        rate,
        isFlatRate,
      },
    });

    return NextResponse.json(newShippingRate, { status: 201 });
  } catch (error) {
    console.error('Error creating shipping rate:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Shipping Zone or Method not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
