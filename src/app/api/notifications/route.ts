import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET all notifications for the current user
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse('Unauthenticated', { status: 401 });
  }

  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(notifications);
  } catch (error) {
    console.error('[NOTIFICATIONS_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

// POST a new notification
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse('Unauthenticated', { status: 401 });
  }

  try {
    const body = await req.json();
    const { message, userId } = body;

    if (!message || !userId) {
      return new NextResponse('Message and userId are required', { status: 400 });
    }

    // Optional: Ensure the user creating the notification is an admin or the user themselves
    // For now, we'll allow any authenticated user to create a notification for any other user

    const notification = await prisma.notification.create({
      data: {
        message,
        userId,
      },
    });

    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    console.error('[NOTIFICATIONS_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
