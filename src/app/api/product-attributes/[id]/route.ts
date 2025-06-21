import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Params {
  params: { id: string };
}

// GET a single product attribute by ID
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const productAttribute = await prisma.productAttribute.findUnique({
      where: { id },
      include: { attribute: true, listValue: true },
    });

    if (!productAttribute) {
      return NextResponse.json({ error: 'Product attribute not found' }, { status: 404 });
    }

    return NextResponse.json(productAttribute);
  } catch (error) {
    console.error('Error fetching product attribute:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT (update) a product attribute by ID
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const body = await request.json();
    const { 
        textValue, 
        numberValue, 
        decimalValue, 
        booleanValue, 
        listValueId 
    } = body;

    const updatedProductAttribute = await prisma.productAttribute.update({
      where: { id },
      data: {
        textValue,
        numberValue,
        decimalValue,
        booleanValue,
        listValueId,
      },
    });

    return NextResponse.json(updatedProductAttribute);
  } catch (error) {
    console.error('Error updating product attribute:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Product attribute not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE a product attribute by ID
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = params;
    await prisma.productAttribute.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error('Error deleting product attribute:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Product attribute not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
