import { NextResponse } from 'next/server';
import prisma from "../../../../prisma/prisma"
// import { getCurrentUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const user = {id: 'user-id-from-session'}; // Remplacez par votre logique d'authentification
    if (!user) return new NextResponse('Non autorisé', { status: 401 });

    const body = await request.json();
    const { 
      name, 
      description, 
      price, 
      originalPrice, 
      stock, 
      categoryId, 
      sku, 
      images, 
      variants, 
      shopId 
    } = body;

    // Validation supplémentaire
    if (!shopId) return new NextResponse('Boutique requise', { status: 400 });

    // Vérification que l'utilisateur possède la boutique
    const shop = await prisma.shop.findFirst({
      where: { id: shopId, ownerId: user.id }
    });
    if (!shop) return new NextResponse('Boutique non trouvée', { status: 404 });

    // Création du produit
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        originalPrice,
        stock,
        sku,
        categoryId,
        shopId,
        ownerId: user.id,
        ProductImage: {
          create: images.map((url: string, index: number) => ({
            url,
            isPrimary: index === 0
          }))
        },
        ProductVariant: {
          create: variants?.map((variant: any) => ({
            name: variant.name,
            options: variant.options
          })) || []
        }
      },
      include: {
        ProductImage: true,
        ProductVariant: true
      }
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('[PRODUCTS_POST]', error);
    return new NextResponse('Erreur interne', { status: 500 });
  }
}