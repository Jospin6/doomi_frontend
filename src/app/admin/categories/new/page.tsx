"use client"
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { toast } from "sonner"
import { generateSlug } from '@/lib/utils';

// 1. Définition du schéma de validation avec Zod
const categorySchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  description: z.string().optional(),
  parentId: z.string().nullable(),
  isActive: z.boolean().default(true)
});

type CategoryFormData = z.infer<typeof categorySchema>;

export default function CategoryForm() {
  const { 
    control,
    handleSubmit,
    register,
    formState: { errors },
    reset
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      isActive: true,
      parentId: null
    }
  });

  // 2. Chargement des catégories parentes
  const { data: parentCategories = [], isLoading } = useQuery({
    queryKey: ['parentCategories'],
    queryFn: async () => {
      const res = await axios.get('/api/categories?parentOnly=true');
      return res.data;
    }
  });

  // 3. Soumission du formulaire
  const onSubmit = async (data: CategoryFormData) => {
    try {
      const response = await axios.post('/api/categories', {
        ...data,
        slug: generateSlug(data.name) // Fonction helper pour générer le slug
      });
      
      if (response.status === 201) {
        toast.success('Catégorie créée avec succès !');
        reset();
      }
    } catch (error) {
      toast.error('Erreur lors de la création');
    }
  };

  // 4. Fonction pour générer un slug
  

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Champ Nom */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nom de la catégorie *
        </label>
        <input
          id="name"
          type="text"
          {...register('name')}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Champ Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          {...register('description')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      {/* Sélecteur de catégorie parente */}
      <div>
        <label htmlFor="parentId" className="block text-sm font-medium text-gray-700">
          Catégorie parente
        </label>
        <Controller
          name="parentId"
          control={control}
          render={({ field }) => (
            <select
              {...field}
              value={field.value ?? ""}
              id="parentId"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              disabled={isLoading}
            >
              <option value="">Aucune (catégorie racine)</option>
              {parentCategories.map((category: any) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          )}
        />
      </div>

      {/* Switch Actif/Inactif */}
      <div className="flex items-center">
        <Controller
          name="isActive"
          control={control}
          render={({ field }) => (
            <input
              type="checkbox"
              id="isActive"
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
          )}
        />
        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
          Catégorie active
        </label>
      </div>

      {/* Bouton de soumission */}
      <div>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Créer la catégorie
        </button>
      </div>
    </form>
  );
}