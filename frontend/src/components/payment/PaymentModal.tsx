import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CreditCard, 
  Building2, 
  Smartphone, 
  QrCode, 
  Shield, 
  Loader2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { PaymentInitDetails, PaymentMethod } from '@/types/payment';
import { apiService } from '@/services/api';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (paymentDetails: PaymentInitDetails) => void;
  orderId: string;
  amount: number;
  currency?: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  orderId,
  amount,
  currency,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkout, setCheckout] = useState<{ reference: string; authUrl: string } | null>(null);
  const [success, setSuccess] = useState(false);

  const paymentMethods = [
    {
      value: 'card' as PaymentMethod,
      label: 'Credit/Debit Card',
      description: 'Pay with your card securely',
      icon: CreditCard,
    },
    {
      value: 'bank_transfer' as PaymentMethod,
      label: 'Bank Transfer',
      description: 'Direct bank transfer',
      icon: Building2,
    },
    {
      value: 'wallet' as PaymentMethod,
      label: 'Digital Wallet',
      description: 'Pay with your digital wallet',
      icon: Smartphone,
    },
    {
      value: 'ussd' as PaymentMethod,
      label: 'USSD',
      description: 'Pay via USSD code',
      icon: Smartphone,
    },
    {
      value: 'qr' as PaymentMethod,
      label: 'QR Code',
      description: 'Scan QR code to pay',
      icon: QrCode,
    },
  ];

  const formatPrice = (amount: number) => `₦${amount.toLocaleString()}`;

  const openPaystack = () => {
    if (!checkout?.authUrl) return;
    if (typeof window !== 'undefined') {
      window.open(checkout.authUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const response = await apiService.initializePaystackPayment(orderId);
      const authUrl = response?.data?.authorization_url || response?.data?.authorizationUrl;
      const reference = response?.data?.reference;

      if (response.success && authUrl && reference) {
        setCheckout({ reference, authUrl });
        if (typeof window !== 'undefined') {
          window.open(authUrl, '_blank', 'noopener,noreferrer');
        }
      } else {
        setError(response.message || 'Payment initialization failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerify = async () => {
    if (!checkout?.reference) return;
    setIsProcessing(true);
    setError(null);

    try {
      const response = await apiService.verifyPaystackPayment(checkout.reference);
      const status = response?.data?.status;

      if (response.success && status === 'success') {
        setSuccess(true);
        onSuccess({
          reference: checkout.reference,
          method: selectedMethod,
          provider: 'paystack',
        });
        onClose();
        return;
      }

      setError(
        response.message ||
          (status ? `Payment not completed yet (status: ${String(status)})` : 'Payment not completed yet')
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment verification failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      setError(null);
      setCheckout(null);
      setSuccess(false);
      onClose();
    }
  };

  const availableMethods = paymentMethods;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Secure Payment
          </DialogTitle>
          <DialogDescription>
            Complete your payment securely using your preferred method
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Amount</span>
                  <span className="font-semibold">{formatPrice(amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Currency</span>
                  <span>{currency || 'NGN'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Order</span>
                  <span className="font-mono text-sm">{orderId}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Selection */}
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <RadioGroup value={selectedMethod} onValueChange={(value) => setSelectedMethod(value as PaymentMethod)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <div key={method.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={method.value} id={method.value} />
                      <Label htmlFor={method.value} className="flex-1 cursor-pointer">
                        <Card className="p-4 hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5 text-primary" />
                            <div>
                              <div className="font-medium">{method.label}</div>
                              <div className="text-sm text-muted-foreground">{method.description}</div>
                            </div>
                          </div>
                        </Card>
                      </Label>
                    </div>
                  );
                })}
              </div>
            </RadioGroup>
          </div>

          {/* Security Information */}
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Your payment is secured with bank-level encryption.
              {selectedMethod === 'card' && ' Your card details are never stored on our servers.'}
              {selectedMethod === 'bank_transfer' && ' You will be redirected to your bank\'s secure portal.'}
            </AlertDescription>
          </Alert>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Success Display */}
          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Payment verified. Finishing up...
              </AlertDescription>
            </Alert>
          )}

          {/* Verification Hint */}
          {checkout && !success && (
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                We opened Paystack in a new tab. Complete payment there, then click <span className="font-medium">Verify payment</span>.
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button variant="outline" onClick={handleClose} disabled={isProcessing} className="flex-1">
              Close
            </Button>
            {checkout ? (
              <>
                <Button variant="outline" onClick={openPaystack} disabled={isProcessing} className="flex-1">
                  Open Paystack
                </Button>
                <Button onClick={handleVerify} disabled={isProcessing || success} className="flex-1">
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : success ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Verified
                    </>
                  ) : (
                    <>Verify payment</>
                  )}
                </Button>
              </>
            ) : (
              <Button onClick={handlePayment} disabled={isProcessing || success} className="flex-1">
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Initializing...
                  </>
                ) : (
                  <>Pay {formatPrice(amount)}</>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
