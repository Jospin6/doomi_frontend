'use client';
import { useEffect, useState } from 'react';
// import { DataTable } from '@/components/ui/data-table';
// import { columns } from './payment-columns';

export function PaymentDashboard() {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      const res = await fetch('/api/admin/payments');
      const data = await res.json();
      setPayments(data);
      setIsLoading(false);
    };
    fetchPayments();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Gestion des paiements</h1>
      {/* <DataTable 
        columns={columns} 
        data={payments} 
        isLoading={isLoading}
      /> */}
    </div>
  );
}