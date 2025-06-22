import { prisma } from '@/lib/prisma';
import CategoryForm from '@/components/categories/CategoryForm';

const NewCategoryPage = async () => {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  return (
    <div className="container mx-auto py-10">
      <CategoryForm categories={categories} />
    </div>
  );
};

export default NewCategoryPage;
