import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Params {
  params: { id: string };
}

// GET a single product variant by ID
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const productVariant = await prisma.productVariant.findUnique({
      where: { id },
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

    if (!productVariant) {
      return NextResponse.json({ error: 'Product variant not found' }, { status: 404 });
    }

    return NextResponse.json(productVariant);
  } catch (error) {
    console.error('Error fetching product variant:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT (update) a product variant by ID
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const body = await request.json();
    const { sku, stockQuantity, price, salePrice, imageUrl, isActive } = body;

    const updatedVariant = await prisma.productVariant.update({
      where: { id },
      data: {
        sku,
        stockQuantity,
        price,
        salePrice,
        imageUrl,
        isActive,
      },
    });

    return NextResponse.json(updatedVariant);
  } catch (error) {
    console.error('Error updating product variant:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Product variant not found' }, { status: 404 });
    }
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2002') {
        return NextResponse.json({ error: 'A variant with this SKU already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE a product variant by ID
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = params;
    await prisma.productVariant.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error('Error deleting product variant:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Product variant not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
