export interface ShippingAddress {
  street: string;
  city: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export enum ShippingMethod {
  STANDARD = "STANDARD",
  EXPRESS = "EXPRESS",
  INTERNATIONAL = "INTERNATIONAL"
}

export enum ShippingStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  RETURNED = "RETURNED"
}

export enum ShipmentStatus {
  PROCESSING = "PROCESSING",
  PACKED = "PACKED",
  SHIPPED = "SHIPPED",
  IN_TRANSIT = "IN_TRANSIT",
  DELIVERED = "DELIVERED",
  RETURNED = "RETURNED"
}

export interface ShippingData {
  id: string;
  orderId: string;
  address: ShippingAddress;
  method: ShippingMethod;
  cost: number;
  carrier?: string;
  trackingNumber?: string;
  status: ShippingStatus;
  estimatedDelivery?: string;
}

export interface ShipmentItem {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  productName: string;
  productImage?: string;
}

export interface ShipmentData {
  id: string;
  orderId: string;
  warehouseId: string;
  carrier: string;
  trackingNumber?: string;
  status: ShipmentStatus;
  shippedAt?: Date;
  estimatedDelivery?: Date;
  items: ShipmentItem[];
}