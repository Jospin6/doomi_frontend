import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all product images (can be filtered by productId or variantId)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');
  const variantId = searchParams.get('variantId');

  try {
    const where: any = {};
    if (productId) where.productId = productId;
    if (variantId) where.variantId = variantId;

    const productImages = await prisma.productImage.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json(productImages);
  } catch (error) {
    console.error('Error fetching product images:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST a new product image
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, variantId, imageUrl, sortOrder, isPrimary } = body;

    if (!imageUrl || (!productId && !variantId)) {
      return NextResponse.json({ error: 'Image URL and either Product ID or Variant ID are required' }, { status: 400 });
    }

    // If isPrimary is true, ensure no other image for the product/variant is primary
    if (isPrimary) {
        const key = productId ? 'productId' : 'variantId';
        const id = productId || variantId;
        await prisma.productImage.updateMany({
            where: { [key]: id },
            data: { isPrimary: false },
        });
    }

    const newProductImage = await prisma.productImage.create({
      data: {
        productId,
        variantId,
        imageUrl,
        sortOrder,
        isPrimary,
      },
    });

    return NextResponse.json(newProductImage, { status: 201 });
  } catch (error) {
    console.error('Error creating product image:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Product or Variant not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
