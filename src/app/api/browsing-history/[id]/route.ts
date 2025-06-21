import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Params {
  params: { id: string };
}

// GET a single browsing history item by ID
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const historyItem = await prisma.browsingHistory.findUnique({
      where: { id },
      include: { 
        product: true,
        user: { select: { id: true, firstName: true, lastName: true } }
      },
    });

    if (!historyItem) {
      return NextResponse.json({ error: 'History item not found' }, { status: 404 });
    }

    return NextResponse.json(historyItem);
  } catch (error) {
    console.error('Error fetching history item:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE a browsing history item by ID
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = params;
    await prisma.browsingHistory.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error('Error deleting history item:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'History item not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
