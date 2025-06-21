import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Params {
  params: { id: string };
}

// GET a single shipping rate by ID
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const shippingRate = await prisma.shippingRate.findUnique({
      where: { id },
      include: { zone: true, method: true },
    });

    if (!shippingRate) {
      return NextResponse.json({ error: 'Shipping rate not found' }, { status: 404 });
    }

    return NextResponse.json(shippingRate);
  } catch (error) {
    console.error('Error fetching shipping rate:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT (update) a shipping rate by ID
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const body = await request.json();
    const { minWeight, maxWeight, rate, isFlatRate } = body;

    const updatedShippingRate = await prisma.shippingRate.update({
      where: { id },
      data: {
        minWeight,
        maxWeight,
        rate,
        isFlatRate,
      },
    });

    return NextResponse.json(updatedShippingRate);
  } catch (error) {
    console.error('Error updating shipping rate:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Shipping rate not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE a shipping rate by ID
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = params;
    await prisma.shippingRate.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error('Error deleting shipping rate:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Shipping rate not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
