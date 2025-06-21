import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        children: true, // Include children categories
        parent: true,   // Include parent category
      },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST a new category
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, parentId, level, path, imageUrl, isActive } = body;

    if (!name || level === undefined) {
      return NextResponse.json({ error: 'Name and level are required' }, { status: 400 });
    }

    const newCategory = await prisma.category.create({
      data: {
        name,
        description,
        parentId,
        level,
        path,
        imageUrl,
        isActive,
      },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
