import { z } from 'zod';

export const DepositSchema = z.object({
  productId: z.string().uuid(),
  warehouseId: z.string().uuid(),
  quantity: z.number().int().positive(),
  notes: z.string().optional()
});

export type ProductDeposit = {
  id: string;
  product: {
    id: string;
    name: string;
    sku: string;
  };
  warehouse: {
    id: string;
    name: string;
  };
  quantity: number;
  depositDate: Date;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'RETURNED';
  notes?: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export type DepositAction = {
  action: 'APPROVE' | 'REJECT' | 'RETURN';
  reason?: string;
  adjustedQuantity?: number;
};