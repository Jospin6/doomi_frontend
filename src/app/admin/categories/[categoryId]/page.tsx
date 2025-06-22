'use client';

import { useEffect } from 'react';
import { useCategoryStore } from '@/stores/useCategoryStore';
import CategoryForm from '@/components/categories/CategoryForm';

const EditCategoryPage = ({ params }: { params: { categoryId: string } }) => {
  const {
    categories,
    fetchCategories,
    isLoading,
  } = useCategoryStore();

  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [fetchCategories, categories.length]);

  const category = categories.find((c) => c.id === params.categoryId);

  if (isLoading) {
    return <div className="container mx-auto py-10">Loading...</div>;
  }

  if (!category) {
    return <div className="container mx-auto py-10">Category not found.</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <CategoryForm initialData={category} />
    </div>
  );
};

export default EditCategoryPage;
