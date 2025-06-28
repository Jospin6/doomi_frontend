import { ShippingStatus } from '@/types/shipping';

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  RETURNED: 'bg-red-100 text-red-800'
};

export function ShippingStatusBadge({ status }: { status: ShippingStatus }) {
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status]}`}>
      {status.toLowerCase()}
    </span>
  );
}