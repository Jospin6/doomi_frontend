import { z } from 'zod';

export const ShopCreateSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  description: z.string().optional(),
  logo: z.instanceof(File).optional(),
  banner: z.instanceof(File).optional(),
  isActive: z.boolean().default(true)
});

export type ShopCreateInput = z.infer<typeof ShopCreateSchema>;