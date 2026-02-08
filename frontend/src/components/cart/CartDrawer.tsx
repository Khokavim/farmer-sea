import { useState } from 'react';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';

interface CartDrawerProps {
  children: React.ReactNode;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ children }) => {
  const { state, updateQuantity, removeItem, getItemCount, getTotalPrice } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const formatPrice = (price: number) => `₦${price.toLocaleString()}`;
  const subtotal = getTotalPrice();
  const shippingCost = subtotal > 5000 ? 0 : 500;
  const tax = subtotal * 0.1;
  const total = subtotal + tax + shippingCost;

  const handleCheckout = () => {
    setIsOpen(false);
    navigate('/checkout');
  };

  const handleViewCart = () => {
    setIsOpen(false);
    navigate('/cart');
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>
      <DrawerContent className="h-[80vh]">
        <DrawerHeader className="text-left">
          <DrawerTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Shopping Cart
            {getItemCount() > 0 && (
              <Badge variant="secondary">{getItemCount()} items</Badge>
            )}
          </DrawerTitle>
          <DrawerDescription>
            Review your selected products
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {state.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingCart className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-4">
                Add some fresh produce to get started
              </p>
              <Button onClick={() => {
                setIsOpen(false);
                navigate('/marketplace');
              }}>
                Browse Products
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {state.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <img
                    src={item.product.images[0] || '/placeholder.svg'}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm line-clamp-2">
                      {item.product.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {item.product.farmerName} • {item.product.location}
                    </p>
                    <p className="text-sm font-medium text-primary">
                      {formatPrice(item.product.price)}/{item.product.unit}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
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
                        className="w-12 h-8 text-center border-0"
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
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">{formatPrice(item.totalPrice)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {state.items.length > 0 && (
          <>
            <Separator />
            <div className="p-4 space-y-4">
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
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={handleViewCart} className="flex-1">
                  View Cart
                </Button>
                <Button onClick={handleCheckout} className="flex-1">
                  Checkout
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default CartDrawer;
