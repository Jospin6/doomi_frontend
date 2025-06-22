import { prisma } from '@/lib/prisma';
import CategoryClient from '@/components/categories/CategoryClient';

const CategoriesPage = async () => {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  return (
    <div className="container mx-auto py-10">
      <CategoryClient categories={categories} />
    </div>
  );
};

export default CategoriesPage;
