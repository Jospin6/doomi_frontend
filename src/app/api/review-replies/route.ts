import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all review replies (must be filtered by reviewId)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reviewId = searchParams.get('reviewId');

  if (!reviewId) {
    return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
  }

  try {
    const reviewReplies = await prisma.reviewReply.findMany({
      where: { reviewId },
      include: {
        user: { select: { firstName: true, lastName: true } },
      },
      orderBy: { replyDate: 'asc' },
    });
    return NextResponse.json(reviewReplies);
  } catch (error) {
    console.error('Error fetching review replies:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST a new review reply
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reviewId, userId, reply } = body;

    if (!reviewId || !userId || !reply) {
      return NextResponse.json({ error: 'reviewId, userId, and reply are required' }, { status: 400 });
    }

    const newReviewReply = await prisma.reviewReply.create({
      data: {
        reviewId,
        userId,
        reply,
      },
    });

    return NextResponse.json(newReviewReply, { status: 201 });
  } catch (error) {
    console.error('Error creating review reply:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Review or User not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
