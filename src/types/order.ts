import { OrderStatus, PaymentStatus } from "@/generated/prisma";

interface Address {
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
}

interface ProductImage {
  url: string;
  altText?: string;
  isPrimary?: boolean;
}

interface ProductVariant {
  id: string;
  name: string;
  options: string[];
}

interface OrderItemProduct {
  id: string;
  name: string;
  images: ProductImage[];
}

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  totalPrice: number;
  product: OrderItemProduct;
  variant?: ProductVariant;
}

interface ShippingInfo {
  carrier: string;
  trackingNumber: string;
  estimatedDelivery?: Date;
  status: 'PENDING' | 'SHIPPED' | 'DELIVERED' | 'RETURNED';
}

interface PaymentInfo {
  method: 'CREDIT_CARD' | 'PAYPAL' | 'BANK_TRANSFER';
  status: PaymentStatus;
  transactionId?: string;
  amountPaid: number;
  paymentDate: Date;
}

export interface OrderWithItems {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  
  // Informations financières
  subtotal: number;
  taxAmount: number;
  shippingFee: number;
  discount: number;
  grandTotal: number;
  
  // Relations
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  
  // Adresses
  shippingAddress: Address;
  billingAddress: Address;
  
  // Logistique
  shipping?: ShippingInfo;
  
  // Paiement
  payment?: PaymentInfo;
  
  // Articles
  items: OrderItem[];
  
  // Références
  cartId?: string;
}