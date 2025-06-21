import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Params {
  params: { id: string };
}

// GET a single warehouse by ID
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const warehouse = await prisma.warehouse.findUnique({
      where: { id },
      include: { inventoryItems: true },
    });

    if (!warehouse) {
      return NextResponse.json({ error: 'Warehouse not found' }, { status: 404 });
    }

    return NextResponse.json(warehouse);
  } catch (error) {
    console.error('Error fetching warehouse:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT (update) a warehouse by ID
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, address, city, province, postalCode, country, contactInfo, isActive } = body;

    const updatedWarehouse = await prisma.warehouse.update({
      where: { id },
      data: {
        name,
        address,
        city,
        province,
        postalCode,
        country,
        contactInfo,
        isActive,
      },
    });

    return NextResponse.json(updatedWarehouse);
  } catch (error) {
    console.error('Error updating warehouse:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Warehouse not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE a warehouse by ID
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = params;
    await prisma.warehouse.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error('Error deleting warehouse:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Warehouse not found' }, { status: 404 });
    }
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2003') {
        return NextResponse.json({ error: 'Cannot delete warehouse. It has inventory items associated with it.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
