import { z } from 'zod';

export const ProductCreateSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  description: z.string().min(10),
  price: z.number().positive("Le prix doit être positif"),
  originalPrice: z.number().positive().optional(),
  discount: z.number().int().min(0).max(100).optional(),
  stock: z.number().int().min(0),
  categoryId: z.string().uuid(),
  sku: z.string().min(3),
  images: z.array(z.instanceof(File)).min(1, "Au moins une image requise"),
  variants: z.array(
    z.object({
      name: z.string().min(1),
      options: z.array(z.string()).min(1)
    })
  ).optional()
});

export type ProductCreateInput = z.infer<typeof ProductCreateSchema>;