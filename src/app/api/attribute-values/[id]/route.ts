import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Params {
  params: { id: string };
}

// GET a single attribute value by ID
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const attributeValue = await prisma.attributeValue.findUnique({
      where: { id },
      include: { attribute: true },
    });

    if (!attributeValue) {
      return NextResponse.json({ error: 'Attribute value not found' }, { status: 404 });
    }

    return NextResponse.json(attributeValue);
  } catch (error) {
    console.error('Error fetching attribute value:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT (update) an attribute value by ID
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const body = await request.json();
    const { value, sortOrder } = body;

    const updatedAttributeValue = await prisma.attributeValue.update({
      where: { id },
      data: {
        value,
        sortOrder,
      },
    });

    return NextResponse.json(updatedAttributeValue);
  } catch (error) {
    console.error('Error updating attribute value:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Attribute value not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE an attribute value by ID
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = params;
    await prisma.attributeValue.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error('Error deleting attribute value:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Attribute value not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
