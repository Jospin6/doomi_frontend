import { CartItem } from '@/generated/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const user = {id: '123'};
  if (!user) return new NextResponse('Unauthorized', { status: 401 });

  const { cartId, shippingAddress, billingAddress, paymentMethod } = await request.json();

  // 1. Récupérer le panier actif
  const cart = await prisma.cart.findUnique({
    where: { id: cartId, userId: user.id, status: 'ACTIVE' },
    include: { items: true }
  });

  if (!cart || cart.items.length === 0) {
    return new NextResponse('Panier invalide', { status: 400 });
  }

  // 2. Calculer les totaux
  const subtotal = cart.items.reduce((sum: any, item: any) => 
    sum + item.price * item.quantity, 0);
  
  const shippingFee = calculateShipping(cart.items);
  const taxAmount = calculateTax(subtotal);
  const grandTotal = subtotal + shippingFee + taxAmount;

  // 3. Générer un numéro de commande unique
  const orderNumber = `CMD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // 4. Créer la commande dans une transaction
  const order = await prisma.$transaction(async (tx: any) => {
    // a. Créer la commande
    const order = await tx.order.create({
      data: {
        orderNumber,
        status: 'PENDING',
        totalAmount: subtotal,
        shippingFee,
        taxAmount,
        grandTotal,
        userId: user.id,
        cartId: cart.id,
        shippingAddress,
        billingAddress,
        paymentMethod,
        items: {
          create: cart.items.map((item: any) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price,
            totalPrice: item.price * item.quantity
          }))
        }
      }
    });

    // b. Mettre à jour le statut du panier
    await tx.cart.update({
      where: { id: cart.id },
      data: { status: 'CONVERTED' }
    });

    // c. Mettre à jour les stocks
    for (const item of cart.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } }
      });
    }

    return order;
  });

  return NextResponse.json(order);
}

// Fonctions helper
function calculateShipping(items: CartItem[]): number {
  // Implémentez votre logique de calcul
  return 9.99;
}

function calculateTax(subtotal: number): number {
  // Exemple: 20% de TVA
  return subtotal * 0.2;
}