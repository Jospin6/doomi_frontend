// app/api/webhooks/shipping/route.ts
import { ShipmentStatus } from '@/generated/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const data = await request.json();

  // Exemple pour FedEx webhook
  if (data.trackingNumber && data.status) {
    await prisma.shipment.updateMany({
      where: { trackingNumber: data.trackingNumber },
      data: {
        status: mapCarrierStatus(data.status),
        ...(data.status === 'DELIVERED' && { deliveredAt: new Date() })
      }
    });

    // Mettre à jour aussi la table Shipping si nécessaire
    await prisma.shipping.updateMany({
      where: { trackingNumber: data.trackingNumber },
      data: { status: mapCarrierStatus(data.status) }
    });
  }

  return NextResponse.json({ received: true });
}

function mapCarrierStatus(carrierStatus: string): ShipmentStatus {
  switch (carrierStatus) {
    case 'IN_TRANSIT': return 'IN_TRANSIT';
    case 'DELIVERED': return 'DELIVERED';
    case 'RETURNED': return 'RETURNED';
    default: return 'SHIPPED';
  }
}