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
  Leaf, 
  Package, 
  TrendingUp, 
  Users, 
  MapPin, 
  Calendar,
  Plus,
  Edit,
  Eye,
  DollarSign,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";

const FarmerAccount = () => {
  // Mock data - in real app, this would come from API
  const farmerStats = {
    totalProducts: 12,
    totalSales: 156,
    totalRevenue: 2450000,
    activeListings: 8,
    pendingOrders: 3,
    completedOrders: 45
  };

  const recentProducts = [
    {
      id: 1,
      name: "Fresh Tomatoes",
      price: 500,
      unit: "kg",
      quantity: 50,
      status: "active",
      location: "Kaduna State"
    },
    {
      id: 2,
      name: "Organic Onions",
      price: 300,
      unit: "kg", 
      quantity: 30,
      status: "active",
      location: "Kaduna State"
    },
    {
      id: 3,
      name: "Green Peppers",
      price: 400,
      unit: "kg",
      quantity: 25,
      status: "pending",
      location: "Kaduna State"
    }
  ];

  const recentOrders = [
    {
      id: "ORD-001",
      buyer: "Fresh Foods Ltd",
      product: "Fresh Tomatoes",
      quantity: 20,
      total: 10000,
      status: "pending",
      date: "2024-01-15"
    },
    {
      id: "ORD-002", 
      buyer: "Market Place Restaurant",
      product: "Organic Onions",
      quantity: 15,
      total: 4500,
      status: "confirmed",
      date: "2024-01-14"
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
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Farmer Account</h1>
              <p className="text-green-100">
                Manage your farm products, track sales, and connect with buyers
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="secondary" className="bg-white text-green-600 hover:bg-gray-100">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
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
                  <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                  <p className="text-2xl font-bold">{farmerStats.totalProducts}</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                  <p className="text-2xl font-bold">{farmerStats.totalSales}</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">{formatPrice(farmerStats.totalRevenue)}</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Active Listings</p>
                  <p className="text-2xl font-bold">{farmerStats.activeListings}</p>
                </div>
                <div className="p-3 rounded-lg bg-orange-100 text-orange-600">
                  <Leaf className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Recent Products
              </CardTitle>
              <CardDescription>
                Manage your farm products and listings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(product.price)}/{product.unit} • {product.quantity} {product.unit} available
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{product.location}</span>
                        <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                          {product.status}
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
                  Add New Product
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
                Track your incoming orders and sales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{order.buyer}</h4>
                      <p className="text-sm text-muted-foreground">
                        {order.product} • {order.quantity} {order.product.split(' ')[1] || 'items'}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-medium">{formatPrice(order.total)}</span>
                        <Badge variant={
                          order.status === 'confirmed' ? 'default' : 
                          order.status === 'pending' ? 'secondary' : 'outline'
                        }>
                          {order.status}
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

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks for managing your farm business
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Plus className="w-6 h-6" />
                <span>Add Product</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Edit className="w-6 h-6" />
                <span>Edit Profile</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <TrendingUp className="w-6 h-6" />
                <span>View Analytics</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Users className="w-6 h-6" />
                <span>Manage Buyers</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default FarmerAccount;

