import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all shipping zones
export async function GET() {
  try {
    const shippingZones = await prisma.shippingZone.findMany({
      include: { shippingRates: true },
    });
    return NextResponse.json(shippingZones);
  } catch (error) {
    console.error('Error fetching shipping zones:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST a new shipping zone
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, provinces, cities, isActive } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const newShippingZone = await prisma.shippingZone.create({
      data: {
        name,
        description,
        provinces,
        cities,
        isActive,
      },
    });

    return NextResponse.json(newShippingZone, { status: 201 });
  } catch (error) {
    console.error('Error creating shipping zone:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
