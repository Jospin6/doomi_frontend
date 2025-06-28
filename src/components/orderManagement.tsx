'use client';
import { useState } from 'react';
import { OrderStatus } from '@/generated/prisma';
import { OrderWithItems } from '@/types/order';

export function OrderManagement({ initialOrders }: { initialOrders: OrderWithItems[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    setIsUpdating(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const updatedOrder = await res.json();
      setOrders(orders.map(o => o.id === orderId ? updatedOrder : o));
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th>N° Commande</th>
            <th>Date</th>
            <th>Client</th>
            <th>Total</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.orderNumber}</td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>{order.user.email}</td>
              <td>{order.grandTotal.toFixed(2)}€</td>
              <td>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'SHIPPED' ? 'bg-purple-100 text-purple-800' :
                  order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {order.status}
                </span>
              </td>
              <td>
                {order.status === 'PENDING' && (
                  <button
                    onClick={() => updateStatus(order.id, 'PROCESSING')}
                    disabled={isUpdating === order.id}
                    className="text-blue-600 hover:underline"
                  >
                    Marquer comme "En préparation"
                  </button>
                )}
                {/* Autres actions selon le statut */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}