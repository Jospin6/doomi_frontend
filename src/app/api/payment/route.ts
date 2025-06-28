import { NextResponse } from 'next/server';
// import { processPayment } from '@/lib/payment';
// import { getCurrentUser } from '@/lib/auth';
import { BillingSchema } from '@/types/billing';

export async function POST(request: Request) {
  const user = { id: '123'};
  if (!user) return new NextResponse('Unauthorized', { status: 401 });

  const { orderId, amount, billing } = await request.json();
  const parsed = BillingSchema.safeParse(billing);

  if (!parsed.success) {
    return NextResponse.json(parsed.error, { status: 400 });
  }

  // Vérifier que la commande appartient à l'utilisateur
  const order = await prisma.order.findUnique({
    where: { id: orderId, userId: user.id }
  });

  if (!order) {
    return new NextResponse('Commande introuvable', { status: 404 });
  }

//   const result = await processPayment(orderId, amount, parsed.data);

//   if (!result.success) {
//     return NextResponse.json(
//       { error: result.error || 'Paiement échoué' },
//       { status: 400 }
//     );
//   }

//   return NextResponse.json(result);
}