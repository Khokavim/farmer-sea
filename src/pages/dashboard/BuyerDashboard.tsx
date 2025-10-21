import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Store, 
  ShoppingCart, 
  TrendingUp, 
  DollarSign, 
  Search, 
  Eye, 
  Plus, 
  Package,
  Truck,
  CreditCard,
  Star
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContextNew';

const BuyerDashboard = () => {
  const { user } = useAuth();

  // Mock data for buyer dashboard
  const stats = [
    { label: 'Active Orders', value: '8', icon: ShoppingCart, color: 'text-blue-600' },
    { label: 'Total Spent', value: '₦2.1M', icon: DollarSign, color: 'text-green-600' },
    { label: 'Saved This Month', value: '₦45,000', icon: TrendingUp, color: 'text-purple-600' },
    { label: 'Favorite Suppliers', value: '12', icon: Star, color: 'text-orange-600' },
  ];

  const recentOrders = [
    {
      id: 'ORD-001',
      product: 'Jos Irish Potatoes',
      supplier: 'Plateau Farmers Cooperative',
      quantity: '5 tonnes',
      total: '₦2,250,000',
      status: 'delivered',
      date: '2025-01-15',
      rating: 5
    },
    {
      id: 'ORD-002',
      product: 'Fresh Tomatoes',
      supplier: 'Northern Agro Suppliers',
      quantity: '2 tonnes',
      total: '₦560,000',
      status: 'shipping',
      date: '2025-01-14',
      rating: 4
    },
    {
      id: 'ORD-003',
      product: 'Sweet Plantains',
      supplier: 'Southwest Fresh Produce',
      quantity: '1 tonne',
      total: '₦320,000',
      status: 'pending',
      date: '2025-01-13',
      rating: null
    }
  ];

  const favoriteSuppliers = [
    {
      id: 1,
      name: 'Plateau Farmers Cooperative',
      location: 'Jos, Plateau State',
      rating: 4.9,
      products: 8,
      lastOrder: '2025-01-15',
      savings: '₦15,000'
    },
    {
      id: 2,
      name: 'Northern Agro Suppliers',
      location: 'Kaduna State',
      rating: 4.6,
      products: 12,
      lastOrder: '2025-01-14',
      savings: '₦8,000'
    },
    {
      id: 3,
      name: 'Southwest Fresh Produce',
      location: 'Ogun State',
      rating: 4.8,
      products: 6,
      lastOrder: '2025-01-13',
      savings: '₦12,000'
    }
  ];

  const recommendedProducts = [
    {
      id: 1,
      name: 'Jos Irish Potatoes',
      supplier: 'Plateau Farmers Cooperative',
      price: '₦450/kg',
      quantity: '50 tonnes',
      quality: 'Grade A',
      savings: '₦50/kg vs market'
    },
    {
      id: 2,
      name: 'Fresh Tomatoes',
      supplier: 'Northern Agro Suppliers',
      price: '₦280/kg',
      quantity: '30 tonnes',
      quality: 'Grade A',
      savings: '₦30/kg vs market'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Buyer Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {user?.name}! Manage your orders and discover fresh produce.
              </p>
            </div>
            <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
              <Search className="w-4 h-4 mr-2" />
              Browse Products
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg bg-muted ${stat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList>
            <TabsTrigger value="orders">My Orders</TabsTrigger>
            <TabsTrigger value="suppliers">Favorite Suppliers</TabsTrigger>
            <TabsTrigger value="products">Recommended</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>
                  Track your orders and delivery status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{order.product}</h3>
                          <Badge variant={
                            order.status === 'delivered' ? 'default' : 
                            order.status === 'shipping' ? 'secondary' : 'outline'
                          }>
                            {order.status}
                          </Badge>
                          {order.rating && (
                            <Badge variant="outline">⭐ {order.rating}</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>Supplier: {order.supplier}</span>
                          <span>Quantity: {order.quantity}</span>
                          <span>Total: {order.total}</span>
                          <span>Date: {order.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        {order.status === 'delivered' && (
                          <Button size="sm">
                            Reorder
                          </Button>
                        )}
                        {order.status === 'shipping' && (
                          <Button size="sm">
                            Track Order
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Suppliers Tab */}
          <TabsContent value="suppliers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Favorite Suppliers</CardTitle>
                <CardDescription>
                  Your trusted suppliers and their performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {favoriteSuppliers.map((supplier) => (
                    <div key={supplier.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{supplier.name}</h3>
                          <Badge variant="outline">⭐ {supplier.rating}</Badge>
                          <Badge variant="secondary">Saved ₦{supplier.savings}</Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>📍 {supplier.location}</span>
                          <span>{supplier.products} products</span>
                          <span>Last order: {supplier.lastOrder}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm">
                          <Plus className="w-4 h-4 mr-1" />
                          Order
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recommended Products</CardTitle>
                <CardDescription>
                  Fresh produce recommended for your business
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendedProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{product.name}</h3>
                          <Badge variant="outline">{product.quality}</Badge>
                          <Badge variant="secondary" className="text-green-600">
                            Save {product.savings}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>Supplier: {product.supplier}</span>
                          <span>{product.quantity} available</span>
                          <span className="font-semibold text-primary">{product.price}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm">
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Spending Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Spending chart will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Top Suppliers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Plateau Farmers Cooperative</span>
                      <span className="font-semibold">₦2,250,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Northern Agro Suppliers</span>
                      <span className="font-semibold">₦560,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Southwest Fresh Produce</span>
                      <span className="font-semibold">₦320,000</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BuyerDashboard;
