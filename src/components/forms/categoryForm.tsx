import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import { createCategory, updateCategory } from "@/redux/category/categorySlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";

const categorySchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  image: z.string().url("L'URL de l'image est invalide"),
  description: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  categoryId?: string;
  defaultValues?: CategoryFormData;
  onSuccess?: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ categoryId, defaultValues, onSuccess }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.category);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues,
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const onSubmit = async (data: CategoryFormData) => {
    if (categoryId) {
      await dispatch(updateCategory({ id: categoryId, data }));
    } else {
      await dispatch(createCategory(data));
    }
    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 border rounded-lg shadow-md">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nom de la catégorie</label>
        <input
          type="text"
          {...register("name")}
          className="mt-1 p-2 w-full border rounded-md"
          placeholder="Nom"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Image (URL)</label>
        <input
          type="text"
          {...register("image")}
          className="mt-1 p-2 w-full border rounded-md"
          placeholder="URL de l'image"
        />
        {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          {...register("description")}
          className="mt-1 p-2 w-full border rounded-md"
          placeholder="Description (optionnel)"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        disabled={loading}
      >
        {loading ? "Enregistrement..." : categoryId ? "Mettre à jour" : "Ajouter"}
      </button>
    </form>
  );
};

export default CategoryForm;
