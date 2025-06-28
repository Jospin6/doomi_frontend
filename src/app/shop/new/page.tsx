import ShopForm from '@/components/shopForm';

export default async function NewShopPage() {

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Créer une nouvelle boutique</h1>
      <ShopForm />
    </div>
  );
}