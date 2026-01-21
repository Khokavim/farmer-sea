import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/product';
import { useCart } from '@/contexts/CartContext';
import { MapPin, Calendar, Star, Eye, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onView?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  showActions?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onView, 
  onAddToCart, 
  showActions = true 
}) => {
  const { addItem } = useCart();
  const formatPrice = (price: number) => `₦${price.toLocaleString()}`;
  const formatQuantity = (quantity: number, unit: string) => {
    if (quantity >= 1000) {
      return `${(quantity / 1000).toFixed(1)} tonnes`;
    }
    return `${quantity.toLocaleString()} ${unit}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'pending': return 'outline';
      case 'out_of_stock': return 'destructive';
      default: return 'secondary';
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'A+': return 'text-green-600 bg-green-50 border-green-200';
      case 'A': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'B': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'C': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden border-border/50">
      <div className="relative">
        <img
          src={product.images[0] || '/placeholder.svg'}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant={getStatusColor(product.status)}>
            {product.status.replace('_', ' ')}
          </Badge>
          <Badge className={`${getQualityColor(product.quality)} border`}>
            {product.quality}
          </Badge>
        </div>
        {product.isVerified && (
          <div className="absolute top-3 right-3">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              ✓ Verified
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {product.description}
            </p>
          </div>

          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span className="line-clamp-1">{product.location}</span>
          </div>

          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>Harvested: {new Date(product.harvestDate).toLocaleDateString()}</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-primary">
              {formatPrice(product.price)}
              <span className="text-sm font-normal text-muted-foreground">/{product.unit}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {formatQuantity(product.quantity, product.unit)} available
            </div>
          </div>

          <div className="pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{product.businessName}</span>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span>4.8 (24 reviews)</span>
                </div>
              </div>
            </div>
          </div>

          {showActions && (
            <div className="flex gap-2 pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => onView?.(product)}
              >
                <Eye className="w-4 h-4 mr-1" />
                View Details
              </Button>
              <Button 
                size="sm" 
                className="flex-1"
                onClick={() => {
                  addItem(product, 1);
                  onAddToCart?.(product);
                }}
                disabled={product.status !== 'active'}
              >
                <ShoppingCart className="w-4 h-4 mr-1" />
                Add to Cart
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
