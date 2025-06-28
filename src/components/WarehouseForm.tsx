'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Warehouse } from '@/types/warehouse';
import { AddressSchema } from '@/types/address';
import { z } from 'zod';

const WarehouseSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  capacity: z.number().int().positive().optional(),
  address: AddressSchema
});

type WarehouseFormValues = z.infer<typeof WarehouseSchema>;

export function WarehouseForm({
  initialData,
  onSubmit,
  isLoading
}: {
  initialData?: Partial<WarehouseFormValues>;
  onSubmit: (data: WarehouseFormValues) => Promise<void>;
  isLoading?: boolean;
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<WarehouseFormValues>({
    resolver: zodResolver(WarehouseSchema),
    defaultValues: initialData
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label>Nom de l'entrepôt*</label>
        <input
          {...register('name')}
          className="w-full p-2 border rounded"
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <label>Capacité (unités)</label>
        <input
          type="number"
          {...register('capacity', { valueAsNumber: true })}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="border p-4 rounded-lg">
        <h3 className="font-medium mb-4">Adresse</h3>
        {/* Champs d'adresse */}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {isLoading ? 'Enregistrement...' : 'Enregistrer'}
      </button>
    </form>
  );
}