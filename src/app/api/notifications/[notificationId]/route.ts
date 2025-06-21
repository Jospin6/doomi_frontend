import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// PUT (update) a notification (e.g., mark as read)
export async function PUT(
  req: Request,
  { params }: { params: { notificationId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse('Unauthenticated', { status: 401 });
  }

  try {
    const { notificationId } = params;
    const body = await req.json();
    const { read } = body;

    if (typeof read !== 'boolean') {
      return new NextResponse('Invalid data: read status must be a boolean', { status: 400 });
    }

    const notificationToUpdate = await prisma.notification.findUnique({
      where: {
        id: notificationId,
      },
    });

    if (notificationToUpdate?.userId !== session.user.id) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    const notification = await prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        read,
      },
    });

    return NextResponse.json(notification);
  } catch (error) {
    console.error('[NOTIFICATION_PUT]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

// DELETE a notification
export async function DELETE(
  req: Request,
  { params }: { params: { notificationId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse('Unauthenticated', { status: 401 });
  }

  try {
    const { notificationId } = params;

    const notificationToDelete = await prisma.notification.findUnique({
      where: {
        id: notificationId,
      },
    });

    if (notificationToDelete?.userId !== session.user.id) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    await prisma.notification.delete({
      where: {
        id: notificationId,
      },
    });

    return new NextResponse('Notification deleted', { status: 200 });
  } catch (error) {
    console.error('[NOTIFICATION_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
