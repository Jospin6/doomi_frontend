import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET a single category by ID
export async function GET(
  request: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const category = await prisma.category.findUnique({
      where: { id: params.categoryId },
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT (update) a category by ID
export async function PUT(
  request: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const body = await request.json();
    const { name, description, parentId } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const updatedCategory = await prisma.category.update({
      where: { id: params.categoryId },
      data: {
        name,
        description,
        parentId: parentId || null, // Ensure parentId is null if empty string is passed
      },
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE a category by ID
export async function DELETE(
  request: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    // Before deleting, check if any products or other categories depend on it.
    // This is a simple delete, but in a real app, you'd handle this gracefully.
    await prisma.category.delete({
      where: { id: params.categoryId },
    });

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error('Error deleting category:', error);
    // Handle cases where deletion is not possible (e.g., foreign key constraints)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
