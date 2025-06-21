import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all wishlist items for a specific user
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        product: { 
          include: { 
            images: { where: { isPrimary: true }, take: 1 } 
          }
        }
      },
      orderBy: { addedAt: 'desc' },
    });
    return NextResponse.json(wishlistItems);
  } catch (error) {
    console.error('Error fetching wishlist items:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST a new item to the wishlist
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, productId } = body;

    if (!userId || !productId) {
      return NextResponse.json({ error: 'userId and productId are required' }, { status: 400 });
    }

    // Check if the item is already in the wishlist
    const existingItem = await prisma.wishlistItem.findFirst({
        where: { userId, productId },
    });

    if (existingItem) {
        return NextResponse.json({ message: 'Item already in wishlist' }, { status: 200 });
    }

    const newWishlistItem = await prisma.wishlistItem.create({
      data: {
        userId,
        productId,
      },
    });

    return NextResponse.json(newWishlistItem, { status: 201 });
  } catch (error) {
    console.error('Error creating wishlist item:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'User or Product not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
