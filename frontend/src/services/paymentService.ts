import { PaymentRequest, PaymentResponse, PaymentDetails, PaymentMethod, PaymentProvider } from '@/types/payment';

// Mock payment service - replace with actual Flutterwave/Paystack integration
class PaymentService {
  private baseUrl = import.meta.env.VITE_PAYMENT_API_URL || 'https://api.farmersea.ng/payments';
  private flutterwavePublicKey = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY || 'FLWPUBK_TEST-1234567890';
  private paystackPublicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_1234567890';

  // Initialize payment with Flutterwave
  async initializeFlutterwavePayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Mock Flutterwave payment initialization
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const reference = `FS_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      return {
        success: true,
        message: 'Payment initialized successfully',
        data: {
          authorizationUrl: `https://checkout.flutterwave.com/v3/hosted/pay/${reference}`,
          reference,
          transactionId: `FLW_${reference}`,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to initialize payment',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Initialize payment with Paystack
  async initializePaystackPayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Mock Paystack payment initialization
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const reference = `FS_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      return {
        success: true,
        message: 'Payment initialized successfully',
        data: {
          authorizationUrl: `https://checkout.paystack.com/${reference}`,
          reference,
          transactionId: `PSK_${reference}`,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to initialize payment',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Verify payment status
  async verifyPayment(reference: string, provider: PaymentProvider): Promise<PaymentResponse> {
    try {
      // Mock payment verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate different payment outcomes
      const isSuccessful = Math.random() > 0.1; // 90% success rate for demo
      
      if (isSuccessful) {
        return {
          success: true,
          message: 'Payment verified successfully',
          data: {
            reference,
            transactionId: `${provider.toUpperCase()}_${reference}`,
          },
        };
      } else {
        return {
          success: false,
          message: 'Payment verification failed',
          error: 'Payment was not successful',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to verify payment',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Get payment methods available for a user
  async getAvailablePaymentMethods(): Promise<PaymentMethod[]> {
    // Mock available payment methods
    return ['card', 'bank_transfer', 'wallet', 'ussd', 'qr'];
  }

  // Get supported banks for bank transfer
  async getSupportedBanks(): Promise<Array<{ code: string; name: string }>> {
    // Mock supported banks
    return [
      { code: '044', name: 'Access Bank' },
      { code: '014', name: 'Afribank Nigeria Plc' },
      { code: '023', name: 'Citibank Nigeria Limited' },
      { code: '050', name: 'Ecobank Nigeria Plc' },
      { code: '011', name: 'First Bank of Nigeria' },
      { code: '214', name: 'First City Monument Bank' },
      { code: '070', name: 'Fidelity Bank Nigeria' },
      { code: '058', name: 'Guaranty Trust Bank' },
      { code: '030', name: 'Heritage Bank' },
      { code: '301', name: 'Jaiz Bank' },
      { code: '082', name: 'Keystone Bank' },
      { code: '221', name: 'Stanbic IBTC Bank' },
      { code: '068', name: 'Standard Chartered Bank' },
      { code: '232', name: 'Sterling Bank' },
      { code: '032', name: 'Union Bank of Nigeria' },
      { code: '033', name: 'United Bank for Africa' },
      { code: '215', name: 'Unity Bank' },
      { code: '035', name: 'Wema Bank' },
      { code: '057', name: 'Zenith Bank' },
    ];
  }

  // Process refund
  async processRefund(transactionId: string, amount: number, reason: string): Promise<PaymentResponse> {
    try {
      // Mock refund processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return {
        success: true,
        message: 'Refund processed successfully',
        data: {
          transactionId,
          reference: `REF_${Date.now()}`,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to process refund',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Get payment history
  async getPaymentHistory(limit: number = 10, offset: number = 0): Promise<PaymentDetails[]> {
    try {
      // Mock payment history
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockPayments: PaymentDetails[] = [
        {
          id: '1',
          orderId: 'ORD-001',
          amount: 2450000,
          currency: 'NGN',
          method: 'card',
          provider: 'flutterwave',
          status: 'successful',
          reference: 'FS_1234567890',
          transactionId: 'FLW_1234567890',
          customerEmail: 'buyer@example.com',
          customerName: 'John Doe',
          customerPhone: '+2348012345678',
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2025-01-15T10:05:00Z',
          paidAt: '2025-01-15T10:05:00Z',
        },
        {
          id: '2',
          orderId: 'ORD-002',
          amount: 560000,
          currency: 'NGN',
          method: 'bank_transfer',
          provider: 'paystack',
          status: 'successful',
          reference: 'FS_0987654321',
          transactionId: 'PSK_0987654321',
          customerEmail: 'buyer@example.com',
          customerName: 'John Doe',
          customerPhone: '+2348012345678',
          createdAt: '2025-01-14T14:30:00Z',
          updatedAt: '2025-01-14T14:35:00Z',
          paidAt: '2025-01-14T14:35:00Z',
        },
      ];
      
      return mockPayments.slice(offset, offset + limit);
    } catch (error) {
      throw new Error('Failed to fetch payment history');
    }
  }
}

export const paymentService = new PaymentService();
