import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET browsing history for a specific user
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const historyItems = await prisma.browsingHistory.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            images: { where: { isPrimary: true }, take: 1 },
          },
        },
      },
      orderBy: { viewedAt: 'desc' },
    });
    return NextResponse.json(historyItems);
  } catch (error) {
    console.error('Error fetching browsing history:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST a new item to the browsing history (uses upsert)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, productId } = body;

    if (!userId || !productId) {
      return NextResponse.json({ error: 'userId and productId are required' }, { status: 400 });
    }

    // If the user has viewed this product before, just update the timestamp.
    // Otherwise, create a new entry. This requires a @@unique([userId, productId]) constraint in the schema.
    const historyItem = await prisma.browsingHistory.upsert({
      where: {
        userId_productId: { userId, productId },
      },
      update: {
        viewedAt: new Date(),
      },
      create: {
        userId,
        productId,
      },
    });

    return NextResponse.json(historyItem, { status: 201 });
  } catch (error) {
    console.error('Error creating browsing history item:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'User or Product not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
