import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Params {
  params: { id: string };
}

// GET a single review reply by ID
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const reviewReply = await prisma.reviewReply.findUnique({
      where: { id },
      include: { user: { select: { firstName: true, lastName: true } } },
    });

    if (!reviewReply) {
      return NextResponse.json({ error: 'Review reply not found' }, { status: 404 });
    }

    return NextResponse.json(reviewReply);
  } catch (error) {
    console.error('Error fetching review reply:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT (update) a review reply by ID
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const body = await request.json();
    const { reply } = body;

    if (!reply) {
        return NextResponse.json({ error: 'Reply content is required' }, { status: 400 });
    }

    const updatedReviewReply = await prisma.reviewReply.update({
      where: { id },
      data: {
        reply,
      },
    });

    return NextResponse.json(updatedReviewReply);
  } catch (error) {
    console.error('Error updating review reply:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Review reply not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE a review reply by ID
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = params;
    await prisma.reviewReply.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error('Error deleting review reply:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Review reply not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
