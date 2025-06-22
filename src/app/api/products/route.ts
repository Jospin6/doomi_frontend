import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET all products
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const sellerId = searchParams.get('sellerId');
    const include = searchParams.get('include'); // e.g., 'variants,images'

  try {
    const where: any = {};
    if (categoryId) where.categoryId = categoryId;
    if (sellerId) where.sellerId = sellerId;

    const includeRelations: any = {
        category: true,
        seller: true,
    };
    if (include) {
        if (include.includes('variants')) includeRelations.variants = true;
        if (include.includes('images')) includeRelations.images = true;
        if (include.includes('attributes')) includeRelations.productAttributes = { include: { attribute: true, listValue: true }};
    }

    const products = await prisma.product.findMany({
        where,
        include: includeRelations
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST a new product
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      name,
      description,
      categoryId,
      price,
      stockQuantity,
      sku,
      weight,
      height,
      width,
      depth,
      images, // Array of strings (URLs)
    } = body;

    const seller = await prisma.seller.findUnique({
      where: { userId: session.user.id },
    });

    if (!seller) {
      return NextResponse.json(
        { error: 'User is not a seller or seller profile not found.' },
        { status: 403 }
      );
    }

    if (!name || !categoryId || price === undefined || !sku || !images || !Array.isArray(images)) {
      return NextResponse.json(
        { error: 'Missing required fields: name, categoryId, price, sku, images' },
        { status: 400 }
      );
    }

    const newProduct = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const product = await tx.product.create({
        data: {
          sellerId: seller.id,
          name,
          description,
          categoryId,
          price,
          stockQuantity,
          sku,
          weight,
          height,
          width,
          depth,
        },
      });

      if (images.length > 0) {
        await tx.productImage.createMany({
          data: images.map((imageUrl: string, index: number) => ({
            productId: product.id,
            url: imageUrl,
            sortOrder: index,
          })),
        });
      }

      return product;
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2002') {
      return NextResponse.json({ error: 'A product with this SKU already exists' }, { status: 409 });
    }
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
      return NextResponse.json({ error: 'Seller or Category not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
