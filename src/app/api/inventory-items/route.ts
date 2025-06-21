import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all inventory items (can be filtered by warehouseId, productId, or variantId)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const warehouseId = searchParams.get('warehouseId');
  const productId = searchParams.get('productId');
  const variantId = searchParams.get('variantId');

  try {
    const where: any = {};
    if (warehouseId) where.warehouseId = warehouseId;
    if (productId) where.productId = productId;
    if (variantId) where.variantId = variantId;

    const inventoryItems = await prisma.inventoryItem.findMany({
      where,
      include: {
        warehouse: { select: { name: true } },
        product: { select: { name: true } },
        variant: { select: { sku: true } },
      },
    });
    return NextResponse.json(inventoryItems);
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST a new inventory item
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { warehouseId, productId, variantId, quantity, stockStatus, location } = body;

    if (!warehouseId || (!productId && !variantId) || quantity === undefined) {
      return NextResponse.json({ error: 'warehouseId, a product/variant ID, and quantity are required' }, { status: 400 });
    }

    const newInventoryItem = await prisma.inventoryItem.create({
      data: {
        warehouseId,
        productId,
        variantId,
        quantity,
        stockStatus,
        location,
      },
    });

    return NextResponse.json(newInventoryItem, { status: 201 });
  } catch (error) {
    console.error('Error creating inventory item:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Warehouse, Product, or Variant not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
