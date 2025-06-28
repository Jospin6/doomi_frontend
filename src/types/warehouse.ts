export interface Warehouse {
  id: string;
  name: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  isActive: boolean;
  capacity?: number;
  currentStock: number;
}

export interface InventoryItem {
  id: string;
  product: {
    id: string;
    name: string;
    sku: string;
    images: string[];
  };
  quantity: number;
  safetyStock: number;
  lastUpdated: Date;
}

export interface StockMovement {
  id: string;
  productId: string;
  warehouseId: string;
  quantity: number;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  reason: string;
  date: Date;
  userId: string;
}