import { Warehouse } from '@/types/warehouse';
// import { DataTable } from '@/components/ui/data-table';
// import { warehouseColumns } from './warehouse-columns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

async function getWarehouses(): Promise<Warehouse[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/warehouses`);
  return res.json();
}

export default async function WarehousesPage() {
  const warehouses = await getWarehouses();

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des entrepôts</h1>
        <Link href="/admin/warehouses/new">
          <Button>+ Nouvel entrepôt</Button>
        </Link>
      </div>

      {/* <DataTable
        columns={warehouseColumns}
        data={warehouses}
      /> */}
    </div>
  );
}