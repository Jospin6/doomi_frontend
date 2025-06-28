import { NextResponse } from "next/server";

// app/api/cart/route.ts
export async function GET() {
  const user = { id: '123', // Simuler un utilisateur authentifié
    name: 'John Doe' }; // Remplacer par votre logique d'authentification
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // 1. Vérifier l'existence d'un panier ACTIF
  const activeCart = await prisma.cart.findFirst({
    where: {
      userId: user.id,
      status: 'ACTIVE',
      expiresAt: { gt: new Date() } // Non expiré
    },
    include: {
      items: {
        include: {
          product: {
            select: {
              name: true,
              ProductImage: { where: { isPrimary: true }, take: 1 }
            }
          }
        }
      }
    }
  });

  // 2. Retourner le panier existant
  if (activeCart) {
    return NextResponse.json({
      cartId: activeCart.id,
      items: activeCart.items.map((item: any) => ({
        id: item.id,
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.price,
        productName: item.product.name,
        productImage: item.product.ProductImage[0]?.url
      }))
    });
  }

  // 3. Créer un nouveau panier si aucun actif
  const newCart = await prisma.cart.create({
    data: {
      userId: user.id,
      status: 'ACTIVE',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 jours
    }
  });

  return NextResponse.json({
    cartId: newCart.id,
    items: []
  });
}