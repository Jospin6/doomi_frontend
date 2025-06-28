import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const user = { id: '123', isAdmin: false };
  if (!user?.isAdmin) return new NextResponse('Forbidden', { status: 403 });

  const { orderId, warehouseId, carrier, items } = await request.json();

  const shipment = await prisma.$transaction(async (tx: any) => {
    // 1. Créer l'expédition
    const shipment = await tx.shipment.create({
      data: {
        orderId,
        warehouseId,
        carrier,
        status: 'PROCESSING'
      }
    });

    // 2. Ajouter les articles
    await tx.shipmentItem.createMany({
      data: items.map((item: any) => ({
        shipmentId: shipment.id,
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity
      }))
    });

    // 3. Mettre à jour le stock
    for (const item of items) {
      await tx.inventory.updateMany({
        where: {
          productId: item.productId,
          warehouseId,
          ...(item.variantId && { variantId: item.variantId })
        },
        data: {
          quantity: { decrement: item.quantity }
        }
      });
    }

    return shipment;
  });

  return NextResponse.json(shipment);
}