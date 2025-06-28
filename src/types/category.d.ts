import { z } from 'zod';

export const CategoryCreateSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  parentId: z.string().nullable().optional(),
  isActive: z.boolean().default(true)
});

export type CategoryCreateInput = z.infer<typeof CategoryCreateSchema>;