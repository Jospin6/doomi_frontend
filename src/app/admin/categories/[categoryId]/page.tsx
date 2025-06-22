import { prisma } from '@/lib/prisma';
import CategoryForm from '@/components/categories/CategoryForm';

const EditCategoryPage = async ({ params }: { params: { categoryId: string } }) => {
  // Fetch the specific category to edit
  const category = await prisma.category.findUnique({
    where: {
      id: params.categoryId,
    },
  });

  // Fetch all categories for the parent dropdown
  const categories = await prisma.category.findMany({
    where: {
      // Exclude the current category from the list of potential parents
      id: {
        not: params.categoryId,
      },
    },
    orderBy: {
      name: 'asc',
    },
  });

  return (
    <div className="container mx-auto py-10">
      <CategoryForm initialData={category} categories={categories} />
    </div>
  );
};

export default EditCategoryPage;
