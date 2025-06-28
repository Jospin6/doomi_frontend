import { z } from 'zod';

export const BillingSchema = z.object({
  address: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    postalCode: z.string().min(1),
    country: z.string().min(1),
  }),
  paymentMethod: z.enum(['CREDIT_CARD', 'PAYPAL', 'BANK_TRANSFER']),
  taxNumber: z.string().optional(),
  saveForFuture: z.boolean().optional()
});

export type BillingData = z.infer<typeof BillingSchema>;

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  error?: string;
  clientSecret?: string; // Pour Stripe
  approvalUrl?: string; // Pour PayPal
}