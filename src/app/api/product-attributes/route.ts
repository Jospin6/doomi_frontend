import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all product attributes (can be filtered by productId)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');

  try {
    const where = productId ? { productId } : {};
    const productAttributes = await prisma.productAttribute.findMany({
      where,
      include: { attribute: true, listValue: true },
    });
    return NextResponse.json(productAttributes);
  } catch (error) {
    console.error('Error fetching product attributes:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST a new product attribute
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
        productId, 
        attributeId, 
        textValue, 
        numberValue, 
        decimalValue, 
        booleanValue, 
        listValueId 
    } = body;

    if (!productId || !attributeId) {
      return NextResponse.json({ error: 'Product ID and Attribute ID are required' }, { status: 400 });
    }

    const newProductAttribute = await prisma.productAttribute.create({
      data: {
        productId,
        attributeId,
        textValue,
        numberValue,
        decimalValue,
        booleanValue,
        listValueId,
      },
    });

    return NextResponse.json(newProductAttribute, { status: 201 });
  } catch (error) {
    console.error('Error creating product attribute:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Product or Attribute not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
