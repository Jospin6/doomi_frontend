'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DepositSchema } from '@/types/deposit';
import { useQuery } from '@tanstack/react-query';

export function DepositForm({ 
  onSubmit, 
  isLoading 
}: { 
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
}) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(DepositSchema)
  });

  // Charger les produits de l'utilisateur et les entrepôts disponibles
  const { data: products } = useQuery({
    queryKey: ['user-products'],
    queryFn: async () => {
      const res = await fetch('/api/products/my-products');
      return res.json();
    }
  });

  const { data: warehouses } = useQuery({
    queryKey: ['warehouses'],
    queryFn: async () => {
      const res = await fetch('/api/warehouses');
      return res.json();
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label>Produit*</label>
          <select
            {...register('productId')}
            className="w-full p-2 border rounded"
          >
            {products?.map((product: any) => (
              <option key={product.id} value={product.id}>
                {product.name} ({product.sku})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Entrepôt*</label>
          <select
            {...register('warehouseId')}
            className="w-full p-2 border rounded"
          >
            {warehouses?.map((warehouse: any) => (
              <option key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label>Quantité*</label>
        <input
          type="number"
          {...register('quantity', { valueAsNumber: true })}
          className="w-full p-2 border rounded"
        />
        {errors.quantity && (
          <p className="text-red-500">{errors.quantity.message}</p>
        )}
      </div>

      <div>
        <label>Notes (optionnel)</label>
        <textarea
          {...register('notes')}
          rows={3}
          className="w-full p-2 border rounded"
          placeholder="Informations sur l'état, emballage spécial, etc."
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {isLoading ? 'Envoi en cours...' : 'Déposer les produits'}
      </button>
    </form>
  );
}