import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all product variants (can be filtered by productId)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');

  try {
    const where = productId ? { productId } : {};
    const productVariants = await prisma.productVariant.findMany({
      where,
      include: {
        variantAttributes: {
          include: {
            attribute: true,
            value: true,
          },
        },
        images: true,
      },
    });
    return NextResponse.json(productVariants);
  } catch (error) {
    console.error('Error fetching product variants:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST a new product variant
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, sku, stockQuantity, price, salePrice, imageUrl, isActive } = body;

    if (!productId || !sku) {
      return NextResponse.json({ error: 'Product ID and SKU are required' }, { status: 400 });
    }

    const newVariant = await prisma.productVariant.create({
      data: {
        productId,
        sku,
        stockQuantity,
        price,
        salePrice,
        imageUrl,
        isActive,
      },
    });

    return NextResponse.json(newVariant, { status: 201 });
  } catch (error) {
    console.error('Error creating product variant:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2002') {
        return NextResponse.json({ error: 'A variant with this SKU already exists' }, { status: 409 });
    }
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
