import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Params {
  params: { id: string };
}

// GET a single inventory item by ID
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const inventoryItem = await prisma.inventoryItem.findUnique({
      where: { id },
      include: { 
        warehouse: true,
        product: true,
        variant: true
      },
    });

    if (!inventoryItem) {
      return NextResponse.json({ error: 'Inventory item not found' }, { status: 404 });
    }

    return NextResponse.json(inventoryItem);
  } catch (error) {
    console.error('Error fetching inventory item:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT (update) an inventory item by ID (e.g., to adjust stock)
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const body = await request.json();
    const { quantity, stockStatus, location } = body;

    const updatedInventoryItem = await prisma.inventoryItem.update({
      where: { id },
      data: {
        quantity,
        stockStatus,
        location,
      },
    });

    return NextResponse.json(updatedInventoryItem);
  } catch (error) {
    console.error('Error updating inventory item:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Inventory item not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE an inventory item by ID
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = params;
    await prisma.inventoryItem.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Inventory item not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
