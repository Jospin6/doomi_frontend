import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Params {
  params: { id: string };
}

// GET a single order item by ID
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const orderItem = await prisma.orderItem.findUnique({
      where: { id },
      include: { product: true, variant: true },
    });

    if (!orderItem) {
      return NextResponse.json({ error: 'Order item not found' }, { status: 404 });
    }

    return NextResponse.json(orderItem);
  } catch (error) {
    console.error('Error fetching order item:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT (update) an order item by ID
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const body = await request.json();
    const { quantity, unitPrice, discount, status } = body;

    const itemToUpdate = await prisma.orderItem.findUnique({ where: { id } });
    if (!itemToUpdate) {
        return NextResponse.json({ error: 'Order item not found' }, { status: 404 });
    }

    const newQuantity = quantity !== undefined ? quantity : itemToUpdate.quantity;
    const newUnitPrice = unitPrice !== undefined ? unitPrice : itemToUpdate.unitPrice;
    const newDiscount = discount !== undefined ? discount : itemToUpdate.discount;
    const newTotalPrice = (newUnitPrice * newQuantity) * (1 - newDiscount);

    const updatedOrderItem = await prisma.orderItem.update({
      where: { id },
      data: {
        quantity,
        unitPrice,
        discount,
        status,
        totalPrice: newTotalPrice,
      },
    });

    // You would also need to update the total amount on the parent Order here

    return NextResponse.json(updatedOrderItem);
  } catch (error) {
    console.error('Error updating order item:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Order item not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE an order item by ID
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = params;

    // You would also need to update the total amount on the parent Order here

    await prisma.orderItem.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error('Error deleting order item:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Order item not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
