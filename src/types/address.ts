import { z } from 'zod';

export const AddressSchema = z.object({
  street: z.string().min(1, "L'adresse est requise"),
  city: z.string().min(1, "La ville est requise"),
  state: z.string().optional(),
  postalCode: z.string().min(1, "Le code postal est requis"),
  country: z.string().min(1, "Le pays est requis"),
  isDefault: z.boolean().default(false)
});

export type AddressFormData = z.infer<typeof AddressSchema>;