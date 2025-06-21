import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Params {
  params: { id: string };
}

// GET a single category-attribute association by ID
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const association = await prisma.categoryAttribute.findUnique({
      where: { id },
      include: { category: true, attribute: true },
    });

    if (!association) {
      return NextResponse.json({ error: 'Association not found' }, { status: 404 });
    }

    return NextResponse.json(association);
  } catch (error) {
    console.error('Error fetching association:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT (update) a category-attribute association by ID
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const body = await request.json();
    const { sortOrder } = body; // Only sortOrder is likely to be updated here

    const updatedAssociation = await prisma.categoryAttribute.update({
      where: { id },
      data: {
        sortOrder,
      },
    });

    return NextResponse.json(updatedAssociation);
  } catch (error) {
    console.error('Error updating association:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Association not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE a category-attribute association by ID
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = params;
    await prisma.categoryAttribute.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error('Error deleting association:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Association not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
