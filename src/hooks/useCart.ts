import { useCartStore } from '@/stores/cartStore';

export function useCart() {
  const { cartId, items, ...rest } = useCartStore();

  const refreshCart = async () => {
    const response = await fetch('/api/cart');
    if (!response.ok) throw new Error('Failed to refresh cart');
    const data = await response.json();
    useCartStore.setState({
      cartId: data.cartId,
      items: data.items || []
    });
  };

  return {
    cartId,
    items,
    refreshCart,
    ...rest
  };
}