import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all sellers
export async function GET() {
  try {
    const sellers = await prisma.seller.findMany({
      include: { user: true }, // Optionally include user details
    });
    return NextResponse.json(sellers);
  } catch (error) {
    console.error('Error fetching sellers:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST a new seller
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, shopName, shopDescription, verificationDocuments } = body;

    if (!userId || !shopName) {
      return NextResponse.json({ error: 'User ID and Shop Name are required' }, { status: 400 });
    }

    const newSeller = await prisma.seller.create({
      data: {
        userId,
        shopName,
        shopDescription,
        verificationDocuments,
      },
    });

    return NextResponse.json(newSeller, { status: 201 });
  } catch (error) {
    console.error('Error creating seller:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2002') {
        return NextResponse.json({ error: 'This user is already a seller' }, { status: 409 });
    }
     if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
