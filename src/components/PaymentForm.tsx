'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BillingSchema, BillingData } from '@/types/billing';
// import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

export function PaymentForm({ orderId, amount }: { orderId: string; amount: number }) {
  const [paymentMethod, setPaymentMethod] = useState<'CREDIT_CARD' | 'PAYPAL' | 'BANK_TRANSFER'>('CREDIT_CARD');
  const [isProcessing, setIsProcessing] = useState(false);
//   const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<BillingData>({
    resolver: zodResolver(BillingSchema),
    defaultValues: {
      paymentMethod: 'CREDIT_CARD'
    }
  });

  const onSubmit = async (data: BillingData) => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          amount,
          billing: data
        })
      });

      const result = await response.json();
    //   setPaymentResult(result);

    //   if (result.success && result.clientSecret) {
    //     // Traiter le paiement Stripe
    //     const stripe = await stripePromise;
    //     const { error } = await stripe!.confirmCardPayment(result.clientSecret);
    //     if (error) throw error;
    //   }
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Sélection de la méthode de paiement */}
          <div className="space-y-4">
            <h3 className="font-medium">Méthode de paiement</h3>
            <div className="flex gap-4">
              {['CREDIT_CARD', 'PAYPAL', 'BANK_TRANSFER'].map(method => (
                <label key={method} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method as any)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>{method === 'CREDIT_CARD' ? 'Carte' : method === 'PAYPAL' ? 'PayPal' : 'Virement'}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Adresse de facturation */}
          <div className="border p-4 rounded-lg">
            <h3 className="font-medium mb-4">Adresse de facturation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Rue</label>
                <input
                  {...register('address.street')}
                  className="mt-1 block w-full border rounded-md p-2"
                />
                {errors.address?.street && (
                  <p className="text-red-500 text-sm">{errors.address.street.message}</p>
                )}
              </div>
              {/* Autres champs d'adresse... */}
            </div>
          </div>

          {/* Champ pour Stripe */}
          {/* {paymentMethod === 'CREDIT_CARD' && (
            <Elements stripe={stripePromise}>
              <div className="border p-4 rounded-lg">
                <h3 className="font-medium mb-4">Détails de la carte</h3>
                <CardElement className="border p-2 rounded-md" />
              </div>
            </Elements>
          )} */}

          {/* Numéro de TVA pour les entreprises */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register('saveForFuture')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Enregistrer ces informations pour mes prochains achats</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className={`w-full py-3 px-6 rounded-lg ${
              isProcessing ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
            } text-white`}
          >
            {isProcessing ? 'Traitement...' : `Payer ${amount.toFixed(2)}€`}
          </button>
        </form>
      </div>

      {/* Récapitulatif de la commande */}
      <div className="border p-6 rounded-lg h-fit">
        <h3 className="font-medium mb-4">Votre commande</h3>
        {/* Afficher les articles, le total, etc. */}
      </div>
    </div>
  );
}