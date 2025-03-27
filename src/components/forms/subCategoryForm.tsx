import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import { createSubCategory, updateSubCategory } from "@/redux/subCategory/subCategorySlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchCategories } from "@/redux/category/categorySlice";

const subCategorySchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  images: z.string().optional(),
  description: z.string().optional(),
  categoryId: z.string().min(1, "La catégorie est requise"),
});

type SubCategoryFormData = z.infer<typeof subCategorySchema>;

interface SubCategoryFormProps {
  subCategoryId?: string;
  defaultValues?: SubCategoryFormData;
  onSuccess?: () => void;
}

const SubCategoryForm: React.FC<SubCategoryFormProps> = ({ subCategoryId, defaultValues, onSuccess }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.subCategory);
  const { categories } = useSelector((state: RootState) => state.category); // Pour récupérer les catégories

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SubCategoryFormData>({
    resolver: zodResolver(subCategorySchema),
    defaultValues,
  });

  useEffect(() => {
    dispatch(fetchCategories())
  }, [])

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const onSubmit = async (data: SubCategoryFormData) => {
    console.log(data)
    dispatch(createSubCategory(data));
    reset()
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 border rounded-lg shadow-md">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nom de la sous-catégorie</label>
        <input
          type="text"
          {...register("name")}
          className="mt-1 p-2 w-full border rounded-md"
          placeholder="Nom"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Images (URLs, séparées par des virgules)</label>
        <input
          type="text"
          {...register("images")}
          className="mt-1 p-2 w-full border rounded-md"
          placeholder="https://image1.jpg, https://image2.jpg"
        />
        {errors.images && <p className="text-red-500 text-sm">{errors.images.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          {...register("description")}
          className="mt-1 p-2 w-full border rounded-md"
          placeholder="Description (optionnel)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Catégorie</label>
        <select {...register("categoryId")} className="mt-1 p-2 w-full border rounded-md">
          <option value="">Sélectionner une catégorie</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.categoryId && <p className="text-red-500 text-sm">{errors.categoryId.message}</p>}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        disabled={loading}
      >
        {loading ? "Enregistrement..." : subCategoryId ? "Mettre à jour" : "Ajouter"}
      </button>
    </form>
  );
};

export default SubCategoryForm;
