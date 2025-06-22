import ProductForm from '@/components/products/ProductForm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

const NewProductPage = async () => {
  const session = await getServerSession(authOptions);

  // Protect the route - only authenticated users can access it
  if (!session) {
    redirect('/api/auth/signin?callbackUrl=/products/new');
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Create a New Product</h1>
      <ProductForm />
    </div>
  );
};

export default NewProductPage;
