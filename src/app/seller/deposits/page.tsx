import { ProductDeposit } from '@/types/deposit';
import { DepositList } from '@/components/DepositList';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

async function getUserDeposits(): Promise<ProductDeposit[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/deposits`, {
    cache: 'no-store'
  });
  return res.json();
}

export default async function MyDepositsPage() {
  const deposits = await getUserDeposits();

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mes dépôts en entrepôt</h1>
        <Link href="/seller/deposits/new">
          <Button>Nouveau dépôt</Button>
        </Link>
      </div>
      <DepositList initialData={deposits} />
    </div>
  );
}