import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Params {
  params: { id: string };
}

// GET a single product image by ID
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const productImage = await prisma.productImage.findUnique({
      where: { id },
    });

    if (!productImage) {
      return NextResponse.json({ error: 'Product image not found' }, { status: 404 });
    }

    return NextResponse.json(productImage);
  } catch (error) {
    console.error('Error fetching product image:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT (update) a product image by ID
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const body = await request.json();
    const { imageUrl, sortOrder, isPrimary } = body;

    const imageToUpdate = await prisma.productImage.findUnique({ where: { id } });
    if (!imageToUpdate) {
        return NextResponse.json({ error: 'Product image not found' }, { status: 404 });
    }

    // If making this image primary, ensure others are not
    if (isPrimary && (imageToUpdate.productId || imageToUpdate.variantId)) {
        const key = imageToUpdate.productId ? 'productId' : 'variantId';
        const keyId = imageToUpdate.productId || imageToUpdate.variantId;
        await prisma.productImage.updateMany({
            where: { 
                [key]: keyId,
                id: { not: id } // Don't update the current image in this transaction
            },
            data: { isPrimary: false },
        });
    }

    const updatedProductImage = await prisma.productImage.update({
      where: { id },
      data: {
        imageUrl,
        sortOrder,
        isPrimary,
      },
    });

    return NextResponse.json(updatedProductImage);
  } catch (error) {
    console.error('Error updating product image:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Product image not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE a product image by ID
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = params;
    await prisma.productImage.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error('Error deleting product image:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Product image not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
