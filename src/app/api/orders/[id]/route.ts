import { NextResponse } from 'next/server';
import { Order } from '@/generated/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { status, trackingNumber, carrier } = await request.json();

  // Validation des transitions de statut
  const validTransitions = {
    PENDING: ['PROCESSING', 'CANCELLED'],
    PROCESSING: ['SHIPPED', 'CANCELLED'],
    SHIPPED: ['DELIVERED', 'RETURNED']
  };

  const order = await prisma.order.findUnique({
    where: { id: params.id }
  });

  if (!order) {
    return new NextResponse('Commande introuvable', { status: 404 });
  }

  if (!validTransitions[order.status as keyof typeof validTransitions]?.includes(status)) {
    return new NextResponse('Transition de statut invalide', { status: 400 });
  }

  const updatedOrder = await prisma.order.update({
    where: { id: params.id },
    data: {
      status,
      ...(status === 'SHIPPED' && {
        shippedAt: new Date(),
        trackingNumber,
        carrier
      }),
      ...(status === 'DELIVERED' && { deliveredAt: new Date() }),
      ...(status === 'CANCELLED' && { updatedAt: new Date() })
    },
    include: {
      user: {
        select: { email: true }
      }
    }
  });

  // Envoyer un email de notification
  await sendOrderStatusEmail(updatedOrder.user.email, updatedOrder);

  return NextResponse.json(updatedOrder);
}

async function sendOrderStatusEmail(email: string, order: Order) {
  // Implémentez l'envoi d'email
}