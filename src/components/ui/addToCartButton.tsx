'use client';
import { useState } from 'react';
import { useAddToCart } from '@/hooks/useAddToCart';
import { useCart } from '@/hooks/useCart';

export function AddToCartButton({
  product,
  variant,
  price
}: {
  product: { id: string; name: string; stock: number };
  variant?: { id: string; name: string };
  price: number;
}) {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useAddToCart();
  const { refreshCart } = useCart();

  const handleAddToCart = async () => {
    setError(null);
    setIsLoading(true);
    
    try {
      await addToCart({
        productId: product.id,
        variantId: variant?.id,
        quantity,
        price
      });
      await refreshCart(); // Met à jour le panier global
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  };

  const maxQuantity = product.stock === -1 ? 10 : Math.min(10, product.stock);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setQuantity(q => Math.max(1, q - 1))}
          disabled={quantity <= 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          -
        </button>
        <span className="w-8 text-center">{quantity}</span>
        <button
          onClick={() => setQuantity(q => Math.min(maxQuantity, q + 1))}
          disabled={quantity >= maxQuantity}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          +
        </button>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={isLoading || product.stock === 0}
        className={`w-full py-2 px-4 rounded ${
          isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
        } text-white disabled:opacity-50`}
      >
        {product.stock === 0 ? 'Rupture de stock' : 
         isLoading ? 'Ajout en cours...' : 'Ajouter au panier'}
      </button>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {variant && (
        <p className="text-sm text-gray-500">Variante: {variant.name}</p>
      )}
    </div>
  );
}