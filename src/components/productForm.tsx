'use client';
import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductCreateSchema, ProductCreateInput } from '@/types/product';
import { uploadImage } from '@/lib/upload';

export default function ProductForm({ shops, categories }: { shops: any[], categories: any[] }) {
  const [selectedShop, setSelectedShop] = useState('');
  const { 
    register, 
    handleSubmit, 
    control,
    formState: { errors } 
  } = useForm<ProductCreateInput>({
    resolver: zodResolver(ProductCreateSchema),
    defaultValues: {
      variants: [{ name: 'Couleur', options: ['Rouge', 'Bleu'] }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants"
  });

  const onSubmit = async (data: ProductCreateInput) => {
    try {
      // Upload des images
      const imageUrls = await Promise.all(
        data.images.map(file => uploadImage(file))
      );

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          shopId: selectedShop,
          images: imageUrls,
          price: Number(data.price),
          originalPrice: data.originalPrice ? Number(data.originalPrice) : null
        })
      });

      if (!response.ok) throw new Error('Erreur lors de la création');
      alert('Produit créé avec succès !');
    } catch (error) {
      console.error(error);
      alert('Erreur: ' + (error as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl mx-auto">
      {/* Sélection de la boutique */}
      <div>
        <label className="block font-medium">Boutique *</label>
        <select 
          value={selectedShop}
          onChange={(e) => setSelectedShop(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
          required
        >
          <option value="">Sélectionnez une boutique</option>
          {shops.map(shop => (
            <option key={shop.id} value={shop.id}>{shop.name}</option>
          ))}
        </select>
      </div>

      {/* Informations de base */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-medium">Nom du produit *</label>
          <input {...register('name')} className="mt-1 block w-full p-2 border rounded" />
          {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block font-medium">SKU *</label>
          <input {...register('sku')} className="mt-1 block w-full p-2 border rounded" />
          {errors.sku && <p className="text-red-600 text-sm">{errors.sku.message}</p>}
        </div>
      </div>

      {/* Prix et stock */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block font-medium">Prix * (€)</label>
          <input 
            type="number" 
            step="0.01" 
            {...register('price', { valueAsNumber: true })} 
            className="mt-1 block w-full p-2 border rounded" 
          />
          {errors.price && <p className="text-red-600 text-sm">{errors.price.message}</p>}
        </div>

        <div>
          <label className="block font-medium">Prix original (€)</label>
          <input 
            type="number" 
            step="0.01" 
            {...register('originalPrice', { valueAsNumber: true })} 
            className="mt-1 block w-full p-2 border rounded" 
          />
        </div>

        <div>
          <label className="block font-medium">Stock *</label>
          <input 
            type="number" 
            {...register('stock', { valueAsNumber: true })} 
            className="mt-1 block w-full p-2 border rounded" 
          />
          {errors.stock && <p className="text-red-600 text-sm">{errors.stock.message}</p>}
        </div>
      </div>

      {/* Catégorie */}
      <div>
        <label className="block font-medium">Catégorie *</label>
        <select 
          {...register('categoryId')} 
          className="mt-1 block w-full p-2 border rounded"
        >
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="block font-medium">Description *</label>
        <textarea 
          {...register('description')} 
          rows={4} 
          className="mt-1 block w-full p-2 border rounded" 
        />
        {errors.description && <p className="text-red-600 text-sm">{errors.description.message}</p>}
      </div>

      {/* Images */}
      <div>
        <label className="block font-medium">Images *</label>
        <input 
          type="file" 
          multiple 
          accept="image/*"
          {...register('images')}
          className="mt-1 block w-full" 
        />
        {errors.images && <p className="text-red-600 text-sm">{errors.images.message}</p>}
      </div>

      {/* Variantes */}
      <div className="border p-4 rounded-lg">
        <h3 className="font-medium mb-4">Variantes (optionnel)</h3>
        
        {fields.map((field, index) => (
          <div key={field.id} className="mb-4 border-b pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Nom de la variante</label>
                <input 
                  {...register(`variants.${index}.name`)} 
                  className="mt-1 block w-full p-2 border rounded" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Options (séparées par des virgules)</label>
                <input 
                  {...register(`variants.${index}.options`)} 
                  className="mt-1 block w-full p-2 border rounded" 
                  placeholder="Rouge, Bleu, Vert"
                />
              </div>
            </div>
            <button 
              type="button" 
              onClick={() => remove(index)}
              className="mt-2 text-red-600 text-sm"
            >
              Supprimer cette variante
            </button>
          </div>
        ))}

        <button 
          type="button" 
          onClick={() => append({ name: '', options: [] })}
          className="mt-2 text-blue-600 text-sm"
        >
          + Ajouter une variante
        </button>
      </div>

      <button 
        type="submit" 
        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        Publier le produit
      </button>
    </form>
  );
}