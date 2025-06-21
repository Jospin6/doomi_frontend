import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all variant attributes (can be filtered by variantId)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const variantId = searchParams.get('variantId');

  try {
    const where = variantId ? { variantId } : {};
    const variantAttributes = await prisma.variantAttribute.findMany({
      where,
      include: { attribute: true, value: true },
    });
    return NextResponse.json(variantAttributes);
  } catch (error) {
    console.error('Error fetching variant attributes:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST a new variant attribute
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { variantId, attributeId, valueId } = body;

    if (!variantId || !attributeId || !valueId) {
      return NextResponse.json({ error: 'Variant ID, Attribute ID, and Value ID are required' }, { status: 400 });
    }

    const newVariantAttribute = await prisma.variantAttribute.create({
      data: {
        variantId,
        attributeId,
        valueId,
      },
    });

    return NextResponse.json(newVariantAttribute, { status: 201 });
  } catch (error) {
    console.error('Error creating variant attribute:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Variant, Attribute, or Value not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
