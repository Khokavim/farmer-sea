export interface CartItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    price: number;
    unit: string;
    images: string[];
    farmerName: string;
    businessName: string;
    location: string;
  };
  quantity: number;
  totalPrice: number;
  addedAt: string;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  shippingCost: number;
  tax: number;
  finalTotal: number;
}

export interface ShippingAddress {
  id?: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface CheckoutData {
  shippingAddress: ShippingAddress;
  paymentMethod: 'card' | 'bank_transfer' | 'wallet';
  deliveryInstructions?: string;
  preferredDeliveryDate?: string;
  useEscrow: boolean;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  farmerId: string;
  farmerName: string;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  shippingCost: number;
  tax: number;
  finalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress: ShippingAddress;
  deliveryInstructions?: string;
  preferredDeliveryDate?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
}

