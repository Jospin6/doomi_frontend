import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Params {
  params: { id: string };
}

// GET a single fulfillment by ID
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const fulfillment = await prisma.fulfillment.findUnique({
      where: { id },
      include: {
        order: true,
        warehouse: true,
      },
    });

    if (!fulfillment) {
      return NextResponse.json({ error: 'Fulfillment not found' }, { status: 404 });
    }

    return NextResponse.json(fulfillment);
  } catch (error) {
    console.error('Error fetching fulfillment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT (update) a fulfillment by ID
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status, notes } = body;

    const updatedFulfillment = await prisma.fulfillment.update({
      where: { id },
      data: {
        status,
        notes,
      },
    });

    return NextResponse.json(updatedFulfillment);
  } catch (error) {
    console.error('Error updating fulfillment:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Fulfillment not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE a fulfillment by ID
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = params;
    await prisma.fulfillment.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error('Error deleting fulfillment:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Fulfillment not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
