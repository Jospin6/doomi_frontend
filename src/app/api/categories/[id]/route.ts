import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Params {
  params: { id: string };
}

// GET a single category by ID
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        children: true,
        parent: true,
        products: true, // See products in this category
        categoryAttributes: { include: { attribute: true } }, // See attributes for this category
      },
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
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, description, parentId, level, path, imageUrl, isActive } = body;

    const updatedCategory = await prisma.category.update({
      where: { id },
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

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE a category by ID
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = params;

    // Note: Deleting a category with children or products might not be ideal.
    // You might want to add logic to prevent this or re-assign them first.
    await prisma.category.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error('Error deleting category:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    // Handle foreign key constraint errors (e.g., products or sub-categories exist)
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2003') {
        return NextResponse.json({ error: 'Cannot delete category. It is associated with products or sub-categories.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
