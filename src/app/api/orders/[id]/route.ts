import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Params {
  params: { id: string };
}

// GET a single order by ID
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        payments: true,
        statusHistory: { orderBy: { changedAt: 'asc' } },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT (update) an order by ID (e.g., to change status)
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const body = await request.json();
    // Only some fields should be updatable, primarily status
    const { status, trackingNumber, estimatedDeliveryDate, notes } = body;

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status,
        trackingNumber,
        estimatedDeliveryDate,
        notes,
      },
    });

    // Optional: Create a record in OrderStatusHistory here

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE an order by ID
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = params;

    // Deleting orders is generally not recommended. 
    // A better approach is to set status to CANCELLED.
    // This is a hard delete for demonstration.
    await prisma.order.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error('Error deleting order:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
