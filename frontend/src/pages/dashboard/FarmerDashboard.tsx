import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Tractor, 
  Package, 
  TrendingUp, 
  DollarSign, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  Calendar,
  MapPin,
  Users
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContextNew';

const FarmerDashboard = () => {
  const { user } = useAuth();

  // Mock data for farmer dashboard
  const stats = [
    { label: 'Total Products', value: '12', icon: Package, color: 'text-blue-600' },
    { label: 'Active Listings', value: '8', icon: TrendingUp, color: 'text-green-600' },
    { label: 'Monthly Revenue', value: '₦245,000', icon: DollarSign, color: 'text-purple-600' },
    { label: 'Orders This Month', value: '23', icon: Users, color: 'text-orange-600' },
  ];

  const recentProducts = [
    {
      id: 1,
      name: 'Jos Irish Potatoes',
      price: '₦450/kg',
      quantity: '50 tonnes',
      status: 'active',
      orders: 12,
      revenue: '₦22,500'
    },
    {
      id: 2,
      name: 'Fresh Tomatoes',
      price: '₦280/kg',
      quantity: '30 tonnes',
      status: 'pending',
      orders: 5,
      revenue: '₦8,400'
    },
    {
      id: 3,
      name: 'Sweet Plantains',
      price: '₦320/kg',
      quantity: '20 tonnes',
      status: 'active',
      orders: 8,
      revenue: '₦12,800'
    }
  ];

  const recentOrders = [
    {
      id: 'ORD-001',
      product: 'Jos Irish Potatoes',
      buyer: 'Lagos Restaurant Chain',
      quantity: '5 tonnes',
      total: '₦2,250,000',
      status: 'pending',
      date: '2025-01-15'
    },
    {
      id: 'ORD-002',
      product: 'Fresh Tomatoes',
      buyer: 'Northern Hotels Ltd',
      quantity: '2 tonnes',
      total: '₦560,000',
      status: 'confirmed',
      date: '2025-01-14'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Farmer Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {user?.name}! Manage your farm products and orders.
              </p>
            </div>
            <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
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
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products">My Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Listings</CardTitle>
                <CardDescription>
                  Manage your farm products and inventory
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{product.name}</h3>
                          <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                            {product.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>{product.price}</span>
                          <span>{product.quantity} available</span>
                          <span>{product.orders} orders</span>
                          <span className="font-medium text-green-600">{product.revenue} revenue</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>
                  Track orders from buyers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{order.product}</h3>
                          <Badge variant={order.status === 'confirmed' ? 'default' : 'secondary'}>
                            {order.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>Buyer: {order.buyer}</span>
                          <span>Quantity: {order.quantity}</span>
                          <span>Total: {order.total}</span>
                          <span>Date: {order.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        {order.status === 'pending' && (
                          <Button size="sm">
                            Confirm Order
                          </Button>
                        )}
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
                  <CardTitle>Revenue Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Revenue chart will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Top Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Jos Irish Potatoes</span>
                      <span className="font-semibold">₦22,500</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Sweet Plantains</span>
                      <span className="font-semibold">₦12,800</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Fresh Tomatoes</span>
                      <span className="font-semibold">₦8,400</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Farm Information</CardTitle>
                <CardDescription>
                  Manage your farm profile and settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Farm Name</label>
                      <p className="text-sm text-muted-foreground">{user?.businessName || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Location</label>
                      <p className="text-sm text-muted-foreground">{user?.location || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Phone</label>
                      <p className="text-sm text-muted-foreground">{user?.phone || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <Button variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FarmerDashboard;
