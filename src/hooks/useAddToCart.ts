import { useCart } from './useCart';

export function useAddToCart() {
  const { cartId } = useCart();

  const addToCart = async ({
    productId,
    variantId,
    quantity,
    price
  }: {
    productId: string;
    variantId?: string;
    quantity: number;
    price: number;
  }) => {
    if (!cartId) throw new Error('Aucun panier actif');

    const response = await fetch('/api/cart/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cartId,
        productId,
        variantId,
        quantity,
        price
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de l\'ajout au panier');
    }

    return await response.json();
  };

  return { addToCart };
}