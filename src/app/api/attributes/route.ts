import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all attributes
export async function GET() {
  try {
    const attributes = await prisma.attribute.findMany({
      include: {
        attributeValues: true, // Include associated values
      },
    });
    return NextResponse.json(attributes);
  } catch (error) {
    console.error('Error fetching attributes:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST a new attribute
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, dataType, isRequired, isVariant } = body;

    if (!name || !dataType) {
      return NextResponse.json({ error: 'Name and dataType are required' }, { status: 400 });
    }

    const newAttribute = await prisma.attribute.create({
      data: {
        name,
        dataType,
        isRequired,
        isVariant,
      },
    });

    return NextResponse.json(newAttribute, { status: 201 });
  } catch (error) {
    console.error('Error creating attribute:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
