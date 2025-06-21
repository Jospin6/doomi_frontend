import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
  try {
    const body = await request.json();
    const { 
        sellerId, 
        name, 
        description, 
        categoryId, 
        price, 
        stockQuantity, 
        sku, 
        weight, 
        height, 
        width, 
        depth 
    } = body;

    if (!sellerId || !name || !categoryId || price === undefined || !sku) {
      return NextResponse.json({ error: 'Missing required fields: sellerId, name, categoryId, price, sku' }, { status: 400 });
    }

    const newProduct = await prisma.product.create({
      data: {
        sellerId,
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
