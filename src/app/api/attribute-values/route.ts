import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all attribute values
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const attributeId = searchParams.get('attributeId');

  try {
    const whereClause = attributeId ? { attributeId } : {};
    const attributeValues = await prisma.attributeValue.findMany({
      where: whereClause,
      include: { attribute: true },
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json(attributeValues);
  } catch (error) {
    console.error('Error fetching attribute values:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST a new attribute value
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { attributeId, value, sortOrder } = body;

    if (!attributeId || !value) {
      return NextResponse.json({ error: 'Attribute ID and value are required' }, { status: 400 });
    }

    const newAttributeValue = await prisma.attributeValue.create({
      data: {
        attributeId,
        value,
        sortOrder,
      },
    });

    return NextResponse.json(newAttributeValue, { status: 201 });
  } catch (error) {
    console.error('Error creating attribute value:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Attribute not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
