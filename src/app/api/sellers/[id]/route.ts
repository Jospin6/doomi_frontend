import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Params {
  params: { id: string };
}

// GET a single seller by ID
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const seller = await prisma.seller.findUnique({
      where: { id },
      include: { user: true, products: true }, // Include related data
    });

    if (!seller) {
      return NextResponse.json({ error: 'Seller not found' }, { status: 404 });
    }

    return NextResponse.json(seller);
  } catch (error) {
    console.error('Error fetching seller:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT (update) a seller by ID
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const body = await request.json();
    const { shopName, shopDescription, verificationStatus, verificationDocuments } = body;

    const updatedSeller = await prisma.seller.update({
      where: { id },
      data: {
        shopName,
        shopDescription,
        verificationStatus,
        verificationDocuments,
      },
    });

    return NextResponse.json(updatedSeller);
  } catch (error) {
    console.error('Error updating seller:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Seller not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE a seller by ID
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = params;

    // You might want to handle what happens to the seller's products.
    // For now, we'll just delete the seller.
    await prisma.seller.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error('Error deleting seller:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Seller not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
