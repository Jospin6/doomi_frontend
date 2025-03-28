"use client"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import { createListing, updateListing } from "@/redux/listing/listingSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { fetchSubCategories } from "@/redux/subCategory/subCategorySlice";
import { fetchDbCities } from "@/redux/cities/citySlice";

const listingSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  price: z.string().min(0, "Le prix doit être supérieur ou égal à 0"),
  currency: z.string().min(1, "La devise est requise"),
  subCategoryId: z.string().min(1, "La sous-catégorie est requise"),
  images: z.array(z.instanceof(File)),
  locationId: z.string().optional(),
  extraFields: z.unknown().optional(),
});

type ListingFormData = z.infer<typeof listingSchema>;

interface ListingFormProps {
  listingId?: string;
  defaultValues?: ListingFormData;
  onSuccess?: () => void;
}

const ListingForm: React.FC<ListingFormProps> = ({ listingId, defaultValues, onSuccess }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.listing);
  const { subCategories } = useSelector((state: RootState) => state.subCategory);
  const { dbCities } = useSelector((state: RootState) => state.city);
  const user = useCurrentUser()

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues,
  });


  useEffect(() => {
    dispatch(fetchSubCategories())
    dispatch(fetchDbCities())
  }, [dispatch])
  

  const onSubmit = async (data: ListingFormData) => {
    if (user) {
      dispatch(createListing({ ...data, userId: user.sub! }));
      reset() 
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 border rounded-lg shadow-md">
      <div>
        <label className="block text-sm font-medium text-gray-700">Titre</label>
        <input
          type="text"
          {...register("title")}
          className="mt-1 p-2 w-full border rounded-md"
          placeholder="Titre"
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          {...register("description")}
          className="mt-1 p-2 w-full border rounded-md"
          placeholder="Description"
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Prix</label>
        <input
          type="number"
          {...register("price")}
          className="mt-1 p-2 w-full border rounded-md"
          placeholder="Prix"
        />
        {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Devise</label>
        <input
          type="text"
          {...register("currency")}
          className="mt-1 p-2 w-full border rounded-md"
          placeholder="Devise"
        />
        {errors.currency && <p className="text-red-500 text-sm">{errors.currency.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Sous-catégorie</label>
        <select {...register("subCategoryId")} className="mt-1 p-2 w-full border rounded-md">
          <option value="">Sélectionner une sous-catégorie</option>
          {subCategories.map((subCat) => (
            <option key={subCat.id} value={subCat.id}>
              {subCat.name}
            </option>
          ))}
        </select>
        {errors.subCategoryId && <p className="text-red-500 text-sm">{errors.subCategoryId.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Images</label>
        <input
          type="file"
          multiple
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            setValue("images", files);
          }}
          className="mt-1 p-2 w-full border rounded-md"
          placeholder="URL de l'image (séparées par des virgules)"
        />
        {errors.images && <p className="text-red-500 text-sm">{errors.images.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Location (optionnelle)</label>
        <select {...register("locationId")} className="mt-1 p-2 w-full border rounded-md">
          <option value="">Sélectionner une location</option>
          {dbCities.map((location) => (
            <option key={location.id} value={location.id}>
              {location.country} - {location.city}
            </option>
          ))}
        </select>
        {errors.locationId && <p className="text-red-500 text-sm">{errors.locationId.message}</p>}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        disabled={loading}
      >
        Ajouter
      </button>
    </form>
  );
};

export default ListingForm;
