import { ProductDeposit } from '@/types/deposit';
import { DepositList } from '@/components/DepositList';

async function getPendingDeposits(): Promise<ProductDeposit[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/deposits/pending`, {
    next: { tags: ['deposits'] }
  });
  return res.json();
}

export default async function DepositsAdminPage() {
  const deposits = await getPendingDeposits();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Validation des dépôts</h1>
      <DepositList initialData={deposits} />
    </div>
  );
}