import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Params {
  params: { id: string };
}

// GET a single shipping method by ID
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const shippingMethod = await prisma.shippingMethod.findUnique({
      where: { id },
    });

    if (!shippingMethod) {
      return NextResponse.json({ error: 'Shipping method not found' }, { status: 404 });
    }

    return NextResponse.json(shippingMethod);
  } catch (error) {
    console.error('Error fetching shipping method:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT (update) a shipping method by ID
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, description, estimatedDeliveryTime, isActive } = body;

    const updatedShippingMethod = await prisma.shippingMethod.update({
      where: { id },
      data: {
        name,
        description,
        estimatedDeliveryTime,
        isActive,
      },
    });

    return NextResponse.json(updatedShippingMethod);
  } catch (error) {
    console.error('Error updating shipping method:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Shipping method not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE a shipping method by ID
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = params;
    await prisma.shippingMethod.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error('Error deleting shipping method:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Shipping method not found' }, { status: 404 });
    }
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2003') {
        return NextResponse.json({ error: 'Cannot delete method. It is associated with shipping rates.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
