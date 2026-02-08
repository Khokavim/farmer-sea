import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContextNew';
import { useNavigate } from 'react-router-dom';
import PaymentModal from '@/components/payment/PaymentModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { apiService } from '@/services/api';
import type { PaymentInitDetails } from '@/types/payment';
import { 
  ArrowLeft, 
  ArrowRight, 
  MapPin, 
  CreditCard, 
  Shield, 
  Truck,
  Loader2,
  CheckCircle
} from 'lucide-react';

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  email: z.string().email('Valid email is required'),
  address: z.string().min(10, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postalCode: z.string().min(3, 'Postal code is required'),
  country: z.string().default('Nigeria'),
  paymentMethod: z.enum(['card', 'bank_transfer', 'wallet']),
  deliveryInstructions: z.string().optional(),
  preferredDeliveryDate: z.string().optional(),
  useEscrow: z.boolean().default(true),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;
type CreatedOrderData = {
  id: string;
  totalAmount?: number;
  total_amount?: number;
};

const Checkout = () => {
  const { state, clearCart, getTotalPrice, getItemCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      country: 'Nigeria',
      paymentMethod: 'card',
      useEscrow: true,
      agreeToTerms: false,
    },
  });

  const watchedPaymentMethod = watch('paymentMethod');
  const watchedUseEscrow = watch('useEscrow');

  const formatPrice = (price: number) => `₦${price.toLocaleString()}`;

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.1;
  const shippingCost = subtotal > 5000 ? 0 : 500;
  const total = subtotal + tax + shippingCost;

  const onSubmit = async (data: CheckoutFormData) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const items = state.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity
      }));

      const shippingAddress = {
        street: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.postalCode
      };

      const response = await apiService.createOrder({
        items,
        shippingAddress,
        billingAddress: shippingAddress,
        notes: data.deliveryInstructions
      });

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to create order');
      }

      const createdOrder = response.data as CreatedOrderData;
      const amount = Number(createdOrder.totalAmount ?? createdOrder.total_amount ?? 0);
      setOrderId(createdOrder.id);
      setPaymentAmount(Number.isFinite(amount) ? amount : 0);
      setShowPaymentModal(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Checkout failed';
      setErrorMessage(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async (_paymentDetails: PaymentInitDetails) => {
    try {
      // Clear cart after successful order
      clearCart();
      setOrderSuccess(true);
      
      // Redirect to order confirmation after 3 seconds
      setTimeout(() => {
        navigate('/orders');
      }, 3000);
    } catch (error) {
      console.error('Order processing failed:', error);
    }
  };

  const handleBackToCart = () => {
    navigate('/cart');
  };

  if (state.items.length === 0 && !orderSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No items in cart</h1>
          <p className="text-muted-foreground mb-6">
            Please add items to your cart before checking out.
          </p>
          <Button onClick={() => navigate('/marketplace')}>
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Order Placed Successfully!</h1>
            <p className="text-muted-foreground mb-6">
              Your order has been confirmed and will be processed shortly.
            </p>
            <div className="space-y-2">
              <Button onClick={() => navigate('/orders')} className="w-full">
                View Orders
              </Button>
              <Button variant="outline" onClick={() => navigate('/marketplace')} className="w-full">
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Page Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
              <p className="text-muted-foreground">
                Complete your order securely
              </p>
            </div>
            <Button variant="outline" onClick={handleBackToCart}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cart
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Shipping Information
                </CardTitle>
                <CardDescription>
                  Where should we deliver your order?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      {...register('fullName')}
                      disabled={isProcessing}
                    />
                    {errors.fullName && (
                      <p className="text-sm text-destructive">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      {...register('phone')}
                      disabled={isProcessing}
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    disabled={isProcessing}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Textarea
                    id="address"
                    rows={3}
                    {...register('address')}
                    disabled={isProcessing}
                  />
                  {errors.address && (
                    <p className="text-sm text-destructive">{errors.address.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      {...register('city')}
                      disabled={isProcessing}
                    />
                    {errors.city && (
                      <p className="text-sm text-destructive">{errors.city.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      {...register('state')}
                      disabled={isProcessing}
                    />
                    {errors.state && (
                      <p className="text-sm text-destructive">{errors.state.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code *</Label>
                    <Input
                      id="postalCode"
                      {...register('postalCode')}
                      disabled={isProcessing}
                    />
                    {errors.postalCode && (
                      <p className="text-sm text-destructive">{errors.postalCode.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryInstructions">Delivery Instructions (Optional)</Label>
                  <Textarea
                    id="deliveryInstructions"
                    rows={2}
                    placeholder="Any special delivery instructions..."
                    {...register('deliveryInstructions')}
                    disabled={isProcessing}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Method
                </CardTitle>
                <CardDescription>
                  Choose your preferred payment method
                </CardDescription>
              </CardHeader>
              <CardContent>
	                <RadioGroup
	                  value={watchedPaymentMethod}
	                  onValueChange={(value) => setValue('paymentMethod', value as CheckoutFormData['paymentMethod'])}
	                  className="space-y-4"
	                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex-1">
                      <div className="flex items-center justify-between">
                        <span>Credit/Debit Card</span>
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-600">Secure</span>
                        </div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                    <Label htmlFor="bank_transfer" className="flex-1">
                      <div className="flex items-center justify-between">
                        <span>Bank Transfer</span>
                        <span className="text-sm text-muted-foreground">Direct transfer</span>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="wallet" id="wallet" />
                    <Label htmlFor="wallet" className="flex-1">
                      <div className="flex items-center justify-between">
                        <span>Digital Wallet</span>
                        <span className="text-sm text-muted-foreground">Quick payment</span>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Security Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security & Protection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="useEscrow"
                    checked={watchedUseEscrow}
                    onCheckedChange={(checked) => setValue('useEscrow', checked as boolean)}
                    disabled={isProcessing}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="useEscrow" className="text-sm font-medium">
                      Use Escrow Protection
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Your payment will be held securely until delivery is confirmed. 
                      This protects both you and the seller.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agreeToTerms"
                    checked={watch('agreeToTerms')}
                    onCheckedChange={(checked) => setValue('agreeToTerms', checked as boolean)}
                    disabled={isProcessing}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="agreeToTerms" className="text-sm font-medium">
                      I agree to the Terms of Service and Privacy Policy
                    </Label>
                    {errors.agreeToTerms && (
                      <p className="text-sm text-destructive">{errors.agreeToTerms.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {errorMessage && (
              <Alert variant="destructive">
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>
                  Review your order details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({getItemCount()} items)</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (10%)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-sm text-green-800">Secure Checkout</span>
                  </div>
                  <p className="text-xs text-green-700">
                    Your payment information is encrypted and secure. 
                    {watchedUseEscrow && ' Funds are protected with escrow.'}
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing Order...
                    </>
                  ) : (
                    <>
                      Place Order
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {state.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img
                        src={item.product.images[0] || '/placeholder.svg'}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.quantity} × {formatPrice(item.product.price)}
                        </p>
                      </div>
                      <p className="text-sm font-medium">
                        {formatPrice(item.totalPrice)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </form>

        {/* Payment Modal */}
        {orderId && (
          <PaymentModal
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            onSuccess={handlePaymentSuccess}
            orderId={orderId}
            amount={paymentAmount || total}
            currency="NGN"
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
