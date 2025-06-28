'use client';
import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
// import { loadStripe } from '@stripe/stripe-js';

export function CheckoutForm() {
  const { cartId, items, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cartId || items.length === 0) return;

    setIsProcessing(true);
    setError('');

    try {
      // 1. Créer l'intention de paiement
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartId,
          shippingAddress: {}, // Remplir avec les données du formulaire
          billingAddress: {}, // Remplir avec les données du formulaire
          paymentMethod: 'card'
        })
      });

      if (!response.ok) {
        throw new Error('Échec de la création de commande');
      }

      const order = await response.json();

      // 2. Rediriger vers le paiement Stripe
    //   const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);
      const paymentResponse = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id, amount: order.grandTotal })
      });

      const { sessionId } = await paymentResponse.json();
    //   await stripe?.redirectToCheckout({ sessionId });

      // 3. Nettoyer le panier après paiement réussi
      await clearCart();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Champs d'adresse et paiement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Address */}
        <div className="border p-4 rounded-lg">
          <h3 className="font-medium mb-4">Adresse de livraison</h3>
          {/* Formulaire d'adresse */}
        </div>

        {/* Billing Address */}
        <div className="border p-4 rounded-lg">
          <h3 className="font-medium mb-4">Adresse de facturation</h3>
          {/* Formulaire de facturation */}
        </div>
      </div>

      {/* Méthode de paiement */}
      <div className="border p-4 rounded-lg">
        <h3 className="font-medium mb-4">Méthode de paiement</h3>
        {/* Sélecteur de méthode de paiement */}
      </div>

      {error && <div className="text-red-500">{error}</div>}

      <button
        type="submit"
        disabled={isProcessing}
        className={`w-full py-3 px-6 rounded-lg ${
          isProcessing ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
        } text-white`}
      >
        {isProcessing ? 'Traitement...' : 'Passer la commande'}
      </button>
    </form>
  );
}