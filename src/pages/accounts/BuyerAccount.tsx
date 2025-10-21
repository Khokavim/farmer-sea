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
  ShoppingCart, 
  Package, 
  TrendingUp, 
  Users, 
  MapPin, 
  Calendar,
  Plus,
  Edit,
  Eye,
  DollarSign,
  Store,
  CheckCircle,
  Clock,
  AlertCircle,
  Star,
  Heart,
  Filter
} from "lucide-react";

const BuyerAccount = () => {
  // Mock data - in real app, this would come from API
  const buyerStats = {
    totalOrders: 24,
    totalSpent: 8500000,
    favoriteSuppliers: 5,
    activeSubscriptions: 3,
    pendingOrders: 2,
    completedOrders: 22
  };

  const favoriteSuppliers = [
    {
      id: 1,
      name: "Kaduna Fresh Produce",
      rating: 4.8,
      products: 25,
      location: "Kaduna State",
      lastOrder: "2024-01-12",
      isFavorite: true
    },
    {
      id: 2,
      name: "Northern Aggregators Ltd",
      rating: 4.6,
      products: 18,
      location: "Kano State",
      lastOrder: "2024-01-10",
      isFavorite: true
    },
    {
      id: 3,
      name: "Green Valley Farms",
      rating: 4.9,
      products: 12,
      location: "Katsina State",
      lastOrder: "2024-01-08",
      isFavorite: false
    }
  ];

  const recentOrders = [
    {
      id: "BUY-001",
      supplier: "Kaduna Fresh Produce",
      product: "Mixed Vegetables",
      quantity: 50,
      total: 25000,
      status: "delivered",
      date: "2024-01-15",
      rating: 5
    },
    {
      id: "BUY-002", 
      supplier: "Northern Aggregators Ltd",
      product: "Fresh Tomatoes",
      quantity: 30,
      total: 15000,
      status: "in_transit",
      date: "2024-01-14",
      rating: null
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
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Business Buyer Account</h1>
              <p className="text-purple-100">
                Manage your purchases, track suppliers, and optimize your supply chain
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Browse Products
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                <Edit className="w-4 h-4 mr-2" />
                Manage Profile
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
                  <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{buyerStats.totalOrders}</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
                  <ShoppingCart className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold">{formatPrice(buyerStats.totalSpent)}</p>
                </div>
                <div className="p-3 rounded-lg bg-green-100 text-green-600">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Favorite Suppliers</p>
                  <p className="text-2xl font-bold">{buyerStats.favoriteSuppliers}</p>
                </div>
                <div className="p-3 rounded-lg bg-pink-100 text-pink-600">
                  <Heart className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Subscriptions</p>
                  <p className="text-2xl font-bold">{buyerStats.activeSubscriptions}</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                  <Store className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Favorite Suppliers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Favorite Suppliers
              </CardTitle>
              <CardDescription>
                Your trusted suppliers and their ratings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {favoriteSuppliers.map((supplier) => (
                  <div key={supplier.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{supplier.name}</h4>
                        {supplier.isFavorite && (
                          <Heart className="w-4 h-4 text-red-500 fill-current" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {supplier.products} products • {supplier.location}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{supplier.rating}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          Last order: {formatDate(supplier.lastOrder)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <ShoppingCart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Find New Suppliers
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Recent Orders
              </CardTitle>
              <CardDescription>
                Track your recent purchases and deliveries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{order.supplier}</h4>
                      <p className="text-sm text-muted-foreground">
                        {order.product} • {order.quantity} kg
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-medium">{formatPrice(order.total)}</span>
                        <Badge variant={
                          order.status === 'delivered' ? 'default' : 
                          order.status === 'in_transit' ? 'secondary' : 'outline'
                        }>
                          {order.status.replace('_', ' ')}
                        </Badge>
                        {order.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className="text-sm">{order.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      {order.status === 'delivered' && !order.rating && (
                        <Button variant="outline" size="sm">
                          <Star className="w-4 h-4" />
                        </Button>
                      )}
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

        {/* Purchase Analytics */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Purchase Analytics
            </CardTitle>
            <CardDescription>
              Insights into your purchasing patterns and supplier performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 border rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Monthly Spending</h3>
                <p className="text-2xl font-bold text-green-600">{formatPrice(1250000)}</p>
                <p className="text-sm text-muted-foreground">+15% from last month</p>
              </div>
              
              <div className="text-center p-6 border rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Avg Supplier Rating</h3>
                <p className="text-2xl font-bold text-blue-600">4.7</p>
                <p className="text-sm text-muted-foreground">Based on 24 orders</p>
              </div>
              
              <div className="text-center p-6 border rounded-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">On-Time Delivery</h3>
                <p className="text-2xl font-bold text-purple-600">92%</p>
                <p className="text-sm text-muted-foreground">Last 30 days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks for managing your business purchases
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <ShoppingCart className="w-6 h-6" />
                <span>Browse Products</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Filter className="w-6 h-6" />
                <span>Find Suppliers</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <TrendingUp className="w-6 h-6" />
                <span>View Analytics</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Heart className="w-6 h-6" />
                <span>Manage Favorites</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default BuyerAccount;

