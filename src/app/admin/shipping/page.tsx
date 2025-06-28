import { ShippingData, ShipmentData } from '@/types/shipping';
import { ShippingStatusBadge } from '@/components/ui/shippingStatusBadge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

async function getPendingShippings(): Promise<ShippingData[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shipping?status=PENDING`);
  return res.json();
}

async function getActiveShipments(): Promise<ShipmentData[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shipments?status=SHIPPED`);
  return res.json();
}

export default async function ShippingAdminPage() {
  const [pendingShippings, activeShipments] = await Promise.all([
    getPendingShippings(),
    getActiveShipments()
  ]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8">Gestion des expéditions</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Commandes en attente */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Commandes à expédier</h2>
          <div className="space-y-4">
            {pendingShippings.map(shipping => (
              <div key={shipping.id} className="border p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Commande #{shipping.orderId}</h3>
                    <p className="text-sm text-gray-500">
                      {shipping.address.city}, {shipping.address.country}
                    </p>
                  </div>
                  <ShippingStatusBadge status={shipping.status} />
                </div>
                <div className="mt-4 flex justify-end">
                  <Link href={`/admin/shipping/${shipping.orderId}`}>
                    <Button size="sm">Préparer l'expédition</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expéditions en cours */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Expéditions en cours</h2>
          <div className="space-y-4">
            {activeShipments.map(shipment => (
              <div key={shipment.id} className="border p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Commande #{shipment.orderId}</h3>
                    <p className="text-sm text-gray-500">
                      {shipment.carrier} • {shipment.trackingNumber}
                    </p>
                  </div>
                  {/* <ShippingStatusBadge status={shipment.status} /> */}
                </div>
                <div className="mt-4">
                  <Link 
                    href={`https://www.${shipment.carrier?.toLowerCase()}.com/tracking/${shipment.trackingNumber}`}
                    target="_blank"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Suivre le colis
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}