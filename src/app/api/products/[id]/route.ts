import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Params {
  params: { id: string };
}

// GET a single product by ID
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        seller: true,
        category: true,
        images: true,
        variants: {
          include: {
            variantAttributes: {
              include: {
                attribute: true,
                value: true,
              },
            },
          },
        },
        productAttributes: {
          include: {
            attribute: true,
            listValue: true,
          },
        },
        reviews: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT (update) a product by ID
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const body = await request.json();
    // Exclude fields that should be managed by other endpoints (e.g., averageRating, reviewCount)
    const { 
        name, 
        description, 
        categoryId, 
        price, 
        salePrice, 
        stockQuantity, 
        sku, 
        isActive, 
        isApproved, 
        weight, 
        height, 
        width, 
        depth 
    } = body;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        categoryId,
        price,
        salePrice,
        stockQuantity,
        sku,
        isActive,
        isApproved,
        weight,
        height,
        width,
        depth,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2002') {
        return NextResponse.json({ error: 'A product with this SKU already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE a product by ID
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = params;

    // Important: Deleting a product requires handling all its relations first
    // (OrderItems, Reviews, Variants, etc.). A transaction is needed for safety.
    // This is a simplified deletion for now.
    // In a real app, you might soft-delete (isActive = false) instead.
    await prisma.product.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error('Error deleting product:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2003') {
        return NextResponse.json({ error: 'Cannot delete product. It is referenced in orders or other records.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
