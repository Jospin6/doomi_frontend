'use client';
import { useState } from 'react';
// import { DataTable } from '@/components/ui/data-table';
// import { inventoryColumns } from './inventory-columns';
import { Button } from '@/components/ui/button';
import { InventoryItem } from '@/types/warehouse';

export function InventoryManagement({ 
  warehouseId,
  initialData 
}: { 
  warehouseId: string;
  initialData: InventoryItem[];
}) {
  const [inventory, setInventory] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);

  const handleStockUpdate = async (productId: string, newQuantity: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/warehouses/${warehouseId}/inventory`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: newQuantity })
      });
      const updatedItem = await response.json();
      setInventory(inventory.map(item => 
        item.product.id === productId ? updatedItem : item
      ));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Gestion des stocks</h3>
        <Button onClick={() => {}}>
          Ajouter un produit
        </Button>
      </div>

      {/* <DataTable
        columns={inventoryColumns(handleStockUpdate)}
        data={inventory}
        isLoading={isLoading}
      /> */}
    </div>
  );
}