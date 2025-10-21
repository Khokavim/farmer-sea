import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Truck, 
  Package, 
  TrendingUp, 
  Users, 
  MapPin, 
  Calendar,
  Plus,
  Edit,
  Eye,
  DollarSign,
  Warehouse,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRightLeft,
  BarChart3
} from "lucide-react";

const SupplierAccount = () => {
  // Mock data - in real app, this would come from API
  const supplierStats = {
    totalSuppliers: 8,
    totalProducts: 45,
    totalRevenue: 12500000,
    activeContracts: 12,
    pendingOrders: 5,
    completedDeliveries: 78
  };

  const supplierNetwork = [
    {
      id: 1,
      name: "Kaduna Farmers Cooperative",
      type: "Cooperative",
      products: 15,
      location: "Kaduna State",
      status: "active",
      lastOrder: "2024-01-10"
    },
    {
      id: 2,
      name: "Northern Produce Aggregators",
      type: "Aggregator",
      products: 22,
      location: "Kano State",
      status: "active",
      lastOrder: "2024-01-08"
    },
    {
      id: 3,
      name: "Fresh Harvest Group",
      type: "Group",
      products: 8,
      location: "Katsina State",
      status: "pending",
      lastOrder: "2024-01-05"
    }
  ];

  const recentOrders = [
    {
      id: "SUP-001",
      buyer: "Lagos Food Market",
      product: "Mixed Vegetables",
      quantity: 500,
      total: 250000,
      status: "in_transit",
      date: "2024-01-15",
      supplier: "Kaduna Farmers Cooperative"
    },
    {
      id: "SUP-002", 
      buyer: "Abuja Restaurant Chain",
      product: "Fresh Tomatoes",
      quantity: 300,
      total: 150000,
      status: "delivered",
      date: "2024-01-12",
      supplier: "Northern Produce Aggregators"
    }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Supplier Account</h1>
              <p className="text-blue-100">
                Manage your supply network, track logistics, and coordinate with farmers
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                <Plus className="w-4 h-4 mr-2" />
                Add Supplier
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Edit className="w-4 h-4 mr-2" />
                Manage Network
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Suppliers</p>
                  <p className="text-2xl font-bold">{supplierStats.totalSuppliers}</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                  <Users className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                  <p className="text-2xl font-bold">{supplierStats.totalProducts}</p>
                </div>
                <div className="p-3 rounded-lg bg-green-100 text-green-600">
                  <Package className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">{formatPrice(supplierStats.totalRevenue)}</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Contracts</p>
                  <p className="text-2xl font-bold">{supplierStats.activeContracts}</p>
                </div>
                <div className="p-3 rounded-lg bg-orange-100 text-orange-600">
                  <Truck className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Supplier Network */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Supplier Network
              </CardTitle>
              <CardDescription>
                Manage your network of farmers and aggregators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {supplierNetwork.map((supplier) => (
                  <div key={supplier.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{supplier.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {supplier.type} • {supplier.products} products
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{supplier.location}</span>
                        <Badge variant={supplier.status === 'active' ? 'default' : 'secondary'}>
                          {supplier.status}
                        </Badge>
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
                <Button variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Supplier
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Recent Orders
              </CardTitle>
              <CardDescription>
                Track orders and deliveries in your network
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{order.buyer}</h4>
                      <p className="text-sm text-muted-foreground">
                        {order.product} • {order.quantity} kg
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Via: {order.supplier}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-medium">{formatPrice(order.total)}</span>
                        <Badge variant={
                          order.status === 'delivered' ? 'default' : 
                          order.status === 'in_transit' ? 'secondary' : 'outline'
                        }>
                          {order.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  View All Orders
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Logistics Dashboard */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Logistics Dashboard
            </CardTitle>
            <CardDescription>
              Monitor deliveries, routes, and supply chain performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 border rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Completed Deliveries</h3>
                <p className="text-2xl font-bold text-green-600">{supplierStats.completedDeliveries}</p>
                <p className="text-sm text-muted-foreground">This month</p>
              </div>
              
              <div className="text-center p-6 border rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">In Transit</h3>
                <p className="text-2xl font-bold text-blue-600">{supplierStats.pendingOrders}</p>
                <p className="text-sm text-muted-foreground">Active deliveries</p>
              </div>
              
              <div className="text-center p-6 border rounded-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Network Performance</h3>
                <p className="text-2xl font-bold text-purple-600">94%</p>
                <p className="text-sm text-muted-foreground">On-time delivery</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks for managing your supply network
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Plus className="w-6 h-6" />
                <span>Add Supplier</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Truck className="w-6 h-6" />
                <span>Track Delivery</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <BarChart3 className="w-6 h-6" />
                <span>View Analytics</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <ArrowRightLeft className="w-6 h-6" />
                <span>Manage Routes</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default SupplierAccount;

