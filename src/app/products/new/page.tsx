"use client"
import prisma  from '../../../../prisma/prisma';
import ProductForm from '@/components/productForm';

export default async function NewProductPage() {
  const session = {user: {id: 'user-id-from-session'}}; // Remplacez par votre logique d'authentification
  if (!session) return <div>Connectez-vous pour continuer</div>;

  // Récupérer les boutiques et catégories de l'utilisateur
  const [shops, categories] = await Promise.all([
    prisma.shop.findMany({
      where: { ownerId: session.user.id }
    }),
    prisma.category.findMany({
      orderBy: { name: 'asc' }
    })
  ]);

  if (shops.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium">Vous n'avez pas encore de boutique</h2>
        <p className="mt-4">
          <a href="/dashboard/shops/new" className="text-blue-600 hover:underline">
            Créez une boutique
          </a> pour commencer à vendre vos produits.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Ajouter un nouveau produit</h1>
      <ProductForm shops={shops} categories={categories} />
    </div>
  );
}