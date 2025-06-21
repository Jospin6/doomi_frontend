import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all shipping methods
export async function GET() {
  try {
    const shippingMethods = await prisma.shippingMethod.findMany();
    return NextResponse.json(shippingMethods);
  } catch (error) {
    console.error('Error fetching shipping methods:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST a new shipping method
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, estimatedDeliveryTime, isActive } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const newShippingMethod = await prisma.shippingMethod.create({
      data: {
        name,
        description,
        estimatedDeliveryTime,
        isActive,
      },
    });

    return NextResponse.json(newShippingMethod, { status: 201 });
  } catch (error) {
    console.error('Error creating shipping method:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
