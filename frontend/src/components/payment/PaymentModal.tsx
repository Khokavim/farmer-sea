import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
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
import { PaymentRequest, PaymentMethod, PaymentProvider } from '@/types/payment';
import { paymentService } from '@/services/paymentService';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (paymentDetails: any) => void;
  paymentRequest: PaymentRequest;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  paymentRequest,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card');
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>('flutterwave');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const paymentMethods = [
    {
      value: 'card' as PaymentMethod,
      label: 'Credit/Debit Card',
      description: 'Pay with your card securely',
      icon: CreditCard,
      providers: ['flutterwave', 'paystack'] as PaymentProvider[],
    },
    {
      value: 'bank_transfer' as PaymentMethod,
      label: 'Bank Transfer',
      description: 'Direct bank transfer',
      icon: Building2,
      providers: ['paystack'] as PaymentProvider[],
    },
    {
      value: 'wallet' as PaymentMethod,
      label: 'Digital Wallet',
      description: 'Pay with your digital wallet',
      icon: Smartphone,
      providers: ['flutterwave'] as PaymentProvider[],
    },
    {
      value: 'ussd' as PaymentMethod,
      label: 'USSD',
      description: 'Pay via USSD code',
      icon: Smartphone,
      providers: ['flutterwave'] as PaymentProvider[],
    },
    {
      value: 'qr' as PaymentMethod,
      label: 'QR Code',
      description: 'Scan QR code to pay',
      icon: QrCode,
      providers: ['flutterwave', 'paystack'] as PaymentProvider[],
    },
  ];

  const formatPrice = (amount: number) => `₦${amount.toLocaleString()}`;

  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      let response;
      
      if (selectedProvider === 'flutterwave') {
        response = await paymentService.initializeFlutterwavePayment(paymentRequest);
      } else {
        response = await paymentService.initializePaystackPayment(paymentRequest);
      }

      if (response.success && response.data?.authorizationUrl) {
        // In a real app, redirect to the payment URL
        // For demo, simulate successful payment
        setTimeout(() => {
          setSuccess(true);
          setTimeout(() => {
            onSuccess({
              reference: response.data?.reference,
              transactionId: response.data?.transactionId,
              method: selectedMethod,
              provider: selectedProvider,
            });
            onClose();
          }, 2000);
        }, 3000);
      } else {
        setError(response.message || 'Payment initialization failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      setError(null);
      setSuccess(false);
      onClose();
    }
  };

  const availableMethods = paymentMethods.filter(method => 
    method.providers.includes(selectedProvider)
  );

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
                  <span className="font-semibold">{formatPrice(paymentRequest.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Currency</span>
                  <span>{paymentRequest.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span>Reference</span>
                  <span className="font-mono text-sm">{paymentRequest.reference}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Provider Selection */}
          <div className="space-y-2">
            <Label>Payment Provider</Label>
            <Select value={selectedProvider} onValueChange={(value) => setSelectedProvider(value as PaymentProvider)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flutterwave">Flutterwave</SelectItem>
                <SelectItem value="paystack">Paystack</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
                Payment successful! Redirecting...
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button variant="outline" onClick={handleClose} disabled={isProcessing} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handlePayment} 
              disabled={isProcessing || success}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : success ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Success
                </>
              ) : (
                <>
                  Pay {formatPrice(paymentRequest.amount)}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;

