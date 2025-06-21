import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Params {
  params: { id: string };
}

// GET a single attribute by ID
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const attribute = await prisma.attribute.findUnique({
      where: { id },
      include: {
        attributeValues: true, // Include associated values
        categoryAttributes: true, // See which categories use this attribute
      },
    });

    if (!attribute) {
      return NextResponse.json({ error: 'Attribute not found' }, { status: 404 });
    }

    return NextResponse.json(attribute);
  } catch (error) {
    console.error('Error fetching attribute:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT (update) an attribute by ID
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, dataType, isRequired, isVariant } = body;

    const updatedAttribute = await prisma.attribute.update({
      where: { id },
      data: {
        name,
        dataType,
        isRequired,
        isVariant,
      },
    });

    return NextResponse.json(updatedAttribute);
  } catch (error) {
    console.error('Error updating attribute:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Attribute not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE an attribute by ID
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = params;

    // Note: Deleting an attribute can have cascading effects.
    // It might be better to mark it as inactive instead.
    await prisma.attribute.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error('Error deleting attribute:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Attribute not found' }, { status: 404 });
    }
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2003') {
        return NextResponse.json({ error: 'Cannot delete attribute. It is currently in use.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
