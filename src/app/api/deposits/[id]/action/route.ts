import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const admin = { id: '123', isAdmin: true };
  if (!admin?.isAdmin) return new NextResponse('Forbidden', { status: 403 });

  const { action, reason, adjustedQuantity } = await request.json();

  const deposit = await prisma.productDeposit.findUnique({
    where: { id: params.id },
    include: { product: true }
  });

  if (!deposit) return new NextResponse('Not found', { status: 404 });

  return await prisma.$transaction(async (tx: any) => {
    // 1. Mettre à jour le statut du dépôt
    const updatedDeposit = await tx.productDeposit.update({
      where: { id: params.id },
      data: { 
        status: action,
        notes: reason 
      }
    });

    // 2. Si approuvé, mettre à jour l'inventaire
    if (action === 'APPROVE') {
      const finalQuantity = adjustedQuantity || deposit.quantity;

      await tx.inventory.upsert({
        where: {
          productId_warehouseId: {
            productId: deposit.productId,
            warehouseId: deposit.warehouseId
          }
        },
        update: {
          quantity: { increment: finalQuantity }
        },
        create: {
          productId: deposit.productId,
          warehouseId: deposit.warehouseId,
          quantity: finalQuantity,
          safetyStock: 10
        }
      });

      // 3. Enregistrer le mouvement de stock
      await tx.stockMovement.create({
        data: {
          productId: deposit.productId,
          warehouseId: deposit.warehouseId,
          quantity: finalQuantity,
          type: 'IN',
          reason: `Dépôt approuvé - ${deposit.id}`,
          userId: admin.id
        }
      });
    }

    // 4. Notifier l'utilisateur
    await sendDepositNotification(deposit.userId, action, reason);

    return NextResponse.json(updatedDeposit);
  });
}

async function sendDepositNotification(
  userId: string, 
  action: string, 
  reason?: string
) {
  // Implémenter la notification (email, notification in-app, etc.)
}