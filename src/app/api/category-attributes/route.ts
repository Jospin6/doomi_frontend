import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all category-attribute associations
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get('categoryId');
  const attributeId = searchParams.get('attributeId');

  try {
    const where: any = {};
    if (categoryId) where.categoryId = categoryId;
    if (attributeId) where.attributeId = attributeId;

    const associations = await prisma.categoryAttribute.findMany({
      where,
      include: { category: true, attribute: true },
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json(associations);
  } catch (error) {
    console.error('Error fetching category-attribute associations:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST a new category-attribute association
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { categoryId, attributeId, sortOrder } = body;

    if (!categoryId || !attributeId) {
      return NextResponse.json({ error: 'Category ID and Attribute ID are required' }, { status: 400 });
    }

    const newAssociation = await prisma.categoryAttribute.create({
      data: {
        categoryId,
        attributeId,
        sortOrder,
      },
    });

    return NextResponse.json(newAssociation, { status: 201 });
  } catch (error) {
    console.error('Error creating category-attribute association:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2002') {
        return NextResponse.json({ error: 'This attribute is already associated with this category' }, { status: 409 });
    }
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Category or Attribute not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
