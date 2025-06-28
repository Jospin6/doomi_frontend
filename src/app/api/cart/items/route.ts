import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const user = { id: '123', // Simuler un utilisateur authentifié
    name: 'John Doe' };
  if (!user) return new NextResponse('Unauthorized', { status: 401 });

  const { cartId, productId, variantId, quantity, price } = await request.json();

  // 1. Vérifier que le panier est actif et appartient à l'utilisateur
  const activeCart = await prisma.cart.findFirst({
    where: {
      id: cartId,
      userId: user.id,
      status: 'ACTIVE',
      expiresAt: { gt: new Date() } // Non expiré
    }
  });

  if (!activeCart) {
    return new NextResponse('Panier invalide ou expiré', { status: 400 });
  }

  // 2. Vérifier le stock disponible (exemple basique)
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { stock: true }
  });

  if (!product || (product.stock !== -1 && product.stock < quantity)) {
    return new NextResponse('Stock insuffisant', { status: 400 });
  }

  // 3. Ajouter ou mettre à jour l'article
  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId,
      productId,
      variantId: variantId || null // Gère les produits sans variante
    }
  });

  let cartItem;
  if (existingItem) {
    // Mise à jour de la quantité
    cartItem = await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity }
    });
  } else {
    // Création d'un nouvel item
    cartItem = await prisma.cartItem.create({
      data: {
        cartId,
        productId,
        variantId,
        quantity,
        price
      }
    });
  }

  // 4. Mettre à jour la date d'expiration du panier
  await prisma.cart.update({
    where: { id: cartId },
    data: { expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } // Réinitialise à 30 jours
  });

  return NextResponse.json(cartItem);
}