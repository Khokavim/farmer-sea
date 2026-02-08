export type PaymentMethod = 'card' | 'bank_transfer' | 'wallet' | 'ussd' | 'qr';
export type PaymentStatus = 'pending' | 'processing' | 'successful' | 'failed' | 'cancelled' | 'refunded';
export type PaymentProvider = 'flutterwave' | 'paystack';

export interface PaymentInitDetails {
  reference?: string;
  method: PaymentMethod;
  provider: PaymentProvider;
}

export interface PaymentDetails {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  provider: PaymentProvider;
  status: PaymentStatus;
  reference: string;
  transactionId?: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  failedAt?: string;
  refundedAt?: string;
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  email: string;
  name: string;
  phone?: string;
  reference: string;
  callbackUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  data?: {
    authorizationUrl?: string;
    reference?: string;
    transactionId?: string;
  };
  error?: string;
}

export interface BankAccount {
  accountNumber: string;
  bankCode: string;
  bankName: string;
  accountName: string;
}

export interface EscrowDetails {
  isEnabled: boolean;
  releaseConditions: string[];
  autoReleaseDays: number;
  manualRelease: boolean;
}
