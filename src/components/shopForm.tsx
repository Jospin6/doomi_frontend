'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ShopCreateSchema, ShopCreateInput } from '@/types/shop';
import { uploadImage } from '@/lib/upload';

export default function ShopForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch
  } = useForm<ShopCreateInput>({
    resolver: zodResolver(ShopCreateSchema)
  });

  const onSubmit = async (data: ShopCreateInput) => {
    try {
      // Upload des images si elles existent
      const [logoUrl, bannerUrl] = await Promise.all([
        data.logo ? uploadImage(data.logo) : undefined,
        data.banner ? uploadImage(data.banner) : undefined
      ]);

      const response = await fetch('/api/shops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          logo: logoUrl,
          banner: bannerUrl
        })
      });

      if (!response.ok) throw new Error('Erreur lors de la création');
      alert('Boutique créée avec succès !');
    } catch (error) {
      console.error(error);
      alert('Erreur: ' + (error as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      {/* Nom */}
      <div>
        <label className="block font-medium">Nom de la boutique *</label>
        <input
          {...register('name')}
          className={`mt-1 block w-full p-2 border rounded ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.name && (
          <p className="mt-1 text-red-600 text-sm">{errors.name.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block font-medium">Description</label>
        <textarea
          {...register('description')}
          rows={3}
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
        />
      </div>

      {/* Logo */}
      <div>
        <label className="block font-medium">Logo</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setValue('logo', e.target.files?.[0])}
          className="mt-1 block"
        />
        {watch('logo') && (
          <div className="mt-2">
            <img
              src={watch('logo') ? URL.createObjectURL(watch('logo')!) : ''}
              alt="Preview"
              className="h-20 object-contain"
            />
          </div>
        )}
      </div>

      {/* Bannière */}
      <div>
        <label className="block font-medium">Bannière</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setValue('banner', e.target.files?.[0])}
          className="mt-1 block"
        />
        {watch('banner') && (
          <div className="mt-2">
            <img
              src={watch('banner') ? URL.createObjectURL(watch('banner')!) : ''}
              alt="Bannière Preview"
              className="w-full h-32 object-cover"
            />
          </div>
        )}
      </div>

      {/* Statut */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isActive"
          {...register('isActive')}
          className="h-4 w-4 rounded border-gray-300"
        />
        <label htmlFor="isActive" className="ml-2">
          Boutique active
        </label>
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Créer la boutique
      </button>
    </form>
  );
}