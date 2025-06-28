// import Stripe from 'stripe';
import { BillingData, PaymentResult } from '@/types/billing';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2023-10-16'
// });

// export async function processPayment(
//   orderId: string,
//   amount: number,
//   billing: BillingData
// ): Promise<PaymentResult> {
//   try {
//     // 1. Enregistrer les informations de facturation
//     const billingRecord = await prisma.billing.create({
//       data: {
//         orderId,
//         address: billing.address,
//         paymentMethod: billing.paymentMethod,
//         taxNumber: billing.taxNumber
//       }
//     });

//     // 2. Traiter le paiement selon la méthode
//     switch (billing.paymentMethod) {
//       case 'CREDIT_CARD':
//         return await processStripePayment(orderId, amount, billing);
//       case 'PAYPAL':
//         return await processPayPalPayment(orderId, amount);
//       case 'BANK_TRANSFER':
//         return { success: true }; // Paiement différé
//       default:
//         throw new Error('Méthode de paiement non supportée');
//     }
//   } catch (error) {
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : 'Erreur de paiement'
//     };
//   }
// }

// async function processStripePayment(
//   orderId: string,
//   amount: number,
//   billing: BillingData
// ): Promise<PaymentResult> {
//   // Créer un Payment Intent
//   const paymentIntent = await stripe.paymentIntents.create({
//     amount: Math.round(amount * 100), // Convertir en cents
//     currency: 'eur',
//     metadata: { orderId },
//     description: `Commande #${orderId}`,
//     receipt_email: billing.email // Ajouter email si disponible
//   });

//   // Mettre à jour Billing avec l'ID de paiement
//   await prisma.billing.update({
//     where: { orderId },
//     data: { paymentId: paymentIntent.id }
//   });

//   return {
//     success: true,
//     paymentId: paymentIntent.id,
//     clientSecret: paymentIntent.client_secret
//   };
// }

// async function processPayPalPayment(
//   orderId: string,
//   amount: number
// ): Promise<PaymentResult> {
//   // Implémentation PayPal (utiliser SDK officiel)
//   const payment = await createPayPalOrder(orderId, amount);
  
//   await prisma.billing.update({
//     where: { orderId },
//     data: { paymentId: payment.id }
//   });

//   return {
//     success: true,
//     paymentId: payment.id,
//     approvalUrl: payment.links.find(link => link.rel === 'approve')?.href
//   };
// }