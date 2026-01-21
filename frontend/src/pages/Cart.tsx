import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Minus, 
  Plus, 
  Trash2, 
  ShoppingCart, 
  ArrowRight, 
  ArrowLeft,
  MapPin,
  Truck
} from 'lucide-react';

const Cart = () => {
  const { cart, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');

  const formatPrice = (price: number) => `₦${price.toLocaleString()}`;

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/marketplace');
  };

  const applyPromoCode = () => {
    // Mock promo code logic
    if (promoCode.toLowerCase() === 'welcome10') {
      // Apply 10% discount
      console.log('Promo code applied!');
    }
  };

  if (cart.state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-12 h-12 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Button onClick={handleContinueShopping} size="lg">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </div>
        </div>
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
              <h1 className="text-3xl font-bold text-foreground">Shopping Cart</h1>
              <p className="text-muted-foreground">
                {cart.getItemCount()} {cart.getItemCount() === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
            <Button variant="outline" onClick={handleContinueShopping}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Cart Items</h2>
              <Button variant="outline" size="sm" onClick={clearCart}>
                Clear Cart
              </Button>
            </div>

            <div className="space-y-4">
              {cart.state.items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.product.images[0] || '/placeholder.svg'}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg line-clamp-2">
                          {item.product.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {item.product.location}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Sold by {item.product.businessName}
                        </p>
                        <p className="text-primary font-medium mt-1">
                          {formatPrice(item.product.price)}/{item.product.unit}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center border rounded-lg">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <Input
                            value={item.quantity}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 0;
                              updateQuantity(item.id, value);
                            }}
                            className="w-16 h-8 text-center border-0"
                            min="1"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-semibold text-lg">
                            {formatPrice(item.totalPrice)}
                          </p>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
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
                    <span>Subtotal ({cart.getItemCount()} items)</span>
                    <span>{formatPrice(cart.getTotalPrice())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>
                      <Badge variant="secondary">Free</Badge>
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (5%)</span>
                    <span>{formatPrice(cart.getTotalPrice() * 0.05)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(cart.getTotalPrice() * 1.05)}</span>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Promo Code</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <Button variant="outline" onClick={applyPromoCode}>
                      Apply
                    </Button>
                  </div>
                </div>

                {/* Shipping Info */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className="w-4 h-4 text-primary" />
                    <span className="font-medium text-sm">Shipping</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Free shipping on orders over ₦50,000
                  </p>
                </div>

                <Button onClick={handleCheckout} className="w-full" size="lg">
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Security Badge */}
            <Card>
              <CardContent className="p-4">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-green-600 font-bold">✓</span>
                  </div>
                  <h4 className="font-semibold text-sm">Secure Checkout</h4>
                  <p className="text-xs text-muted-foreground">
                    Your payment information is encrypted and secure
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
