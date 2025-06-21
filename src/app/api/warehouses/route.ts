import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all warehouses
export async function GET() {
  try {
    const warehouses = await prisma.warehouse.findMany({
      include: { inventoryItems: { take: 10 } }, // Include a few inventory items as a preview
    });
    return NextResponse.json(warehouses);
  } catch (error) {
    console.error('Error fetching warehouses:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST a new warehouse
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, address, city, province, postalCode, country, contactInfo, isActive } = body;

    if (!name || !address || !city || !country) {
      return NextResponse.json({ error: 'name, address, city, and country are required' }, { status: 400 });
    }

    const newWarehouse = await prisma.warehouse.create({
      data: {
        name,
        address,
        city,
        province,
        postalCode,
        country,
        contactInfo,
        isActive,
      },
    });

    return NextResponse.json(newWarehouse, { status: 201 });
  } catch (error) {
    console.error('Error creating warehouse:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
