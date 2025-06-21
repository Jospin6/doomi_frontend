import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Params {
  params: { id: string };
}

// GET a single shipping zone by ID
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const shippingZone = await prisma.shippingZone.findUnique({
      where: { id },
      include: { shippingRates: { include: { method: true } } },
    });

    if (!shippingZone) {
      return NextResponse.json({ error: 'Shipping zone not found' }, { status: 404 });
    }

    return NextResponse.json(shippingZone);
  } catch (error) {
    console.error('Error fetching shipping zone:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT (update) a shipping zone by ID
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, description, provinces, cities, isActive } = body;

    const updatedShippingZone = await prisma.shippingZone.update({
      where: { id },
      data: {
        name,
        description,
        provinces,
        cities,
        isActive,
      },
    });

    return NextResponse.json(updatedShippingZone);
  } catch (error) {
    console.error('Error updating shipping zone:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Shipping zone not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE a shipping zone by ID
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = params;
    await prisma.shippingZone.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error('Error deleting shipping zone:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Shipping zone not found' }, { status: 404 });
    }
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2003') {
        return NextResponse.json({ error: 'Cannot delete zone. It is associated with shipping rates.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
