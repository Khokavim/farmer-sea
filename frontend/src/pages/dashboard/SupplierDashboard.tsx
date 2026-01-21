import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  Package, 
  TrendingUp, 
  DollarSign, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  Users,
  Truck,
  Shield
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContextNew';

const SupplierDashboard = () => {
  const { user } = useAuth();

  // Mock data for supplier dashboard
  const stats = [
    { label: 'Total Inventory', value: '156 tonnes', icon: Package, color: 'text-blue-600' },
    { label: 'Active Suppliers', value: '24', icon: Users, color: 'text-green-600' },
    { label: 'Monthly Revenue', value: '₦1.2M', icon: DollarSign, color: 'text-purple-600' },
    { label: 'Orders This Month', value: '47', icon: Truck, color: 'text-orange-600' },
  ];

  const inventoryItems = [
    {
      id: 1,
      product: 'Jos Irish Potatoes',
      supplier: 'Plateau Farmers Cooperative',
      quantity: '50 tonnes',
      price: '₦450/kg',
      status: 'available',
      quality: 'Grade A'
    },
    {
      id: 2,
      product: 'Fresh Tomatoes',
      supplier: 'Northern Agro Suppliers',
      quantity: '30 tonnes',
      price: '₦280/kg',
      status: 'low_stock',
      quality: 'Grade A'
    },
    {
      id: 3,
      product: 'Sweet Plantains',
      supplier: 'Southwest Fresh Produce',
      quantity: '20 tonnes',
      price: '₦320/kg',
      status: 'available',
      quality: 'Grade A+'
    }
  ];

  const recentOrders = [
    {
      id: 'ORD-001',
      product: 'Jos Irish Potatoes',
      buyer: 'Lagos Restaurant Chain',
      quantity: '10 tonnes',
      total: '₦4,500,000',
      status: 'processing',
      date: '2025-01-15'
    },
    {
      id: 'ORD-002',
      product: 'Fresh Tomatoes',
      buyer: 'Northern Hotels Ltd',
      quantity: '5 tonnes',
      total: '₦1,400,000',
      status: 'shipped',
      date: '2025-01-14'
    }
  ];

  const supplierNetwork = [
    {
      id: 1,
      name: 'Plateau Farmers Cooperative',
      location: 'Jos, Plateau State',
      products: 8,
      rating: 4.8,
      status: 'verified'
    },
    {
      id: 2,
      name: 'Northern Agro Suppliers',
      location: 'Kaduna State',
      products: 12,
      rating: 4.6,
      status: 'verified'
    },
    {
      id: 3,
      name: 'Southwest Fresh Produce',
      location: 'Ogun State',
      products: 6,
      rating: 4.9,
      status: 'pending'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Supplier Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {user?.name}! Manage your supply network and inventory.
              </p>
            </div>
            <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Add Inventory
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
        <Tabs defaultValue="inventory" className="space-y-6">
          <TabsList>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="suppliers">Supplier Network</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Management</CardTitle>
                <CardDescription>
                  Manage your product inventory and suppliers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inventoryItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{item.product}</h3>
                          <Badge variant={item.status === 'available' ? 'default' : 'secondary'}>
                            {item.status === 'low_stock' ? 'Low Stock' : item.status}
                          </Badge>
                          <Badge variant="outline">{item.quality}</Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>Supplier: {item.supplier}</span>
                          <span>{item.quantity} available</span>
                          <span>{item.price}</span>
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
                  Track orders from business buyers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{order.product}</h3>
                          <Badge variant={order.status === 'shipped' ? 'default' : 'secondary'}>
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
                        {order.status === 'processing' && (
                          <Button size="sm">
                            Update Status
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Supplier Network Tab */}
          <TabsContent value="suppliers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Supplier Network</CardTitle>
                <CardDescription>
                  Manage your network of farmers and suppliers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {supplierNetwork.map((supplier) => (
                    <div key={supplier.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{supplier.name}</h3>
                          <Badge variant={supplier.status === 'verified' ? 'default' : 'secondary'}>
                            {supplier.status}
                          </Badge>
                          <Badge variant="outline">⭐ {supplier.rating}</Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>📍 {supplier.location}</span>
                          <span>{supplier.products} products</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
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
                      <span className="font-semibold">₦4,500,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Fresh Tomatoes</span>
                      <span className="font-semibold">₦1,400,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Sweet Plantains</span>
                      <span className="font-semibold">₦640,000</span>
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

export default SupplierDashboard;
