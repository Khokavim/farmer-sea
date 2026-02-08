import { useState } from 'react';
import { useOrders } from '@/contexts/OrderContext';
import { OrderProvider } from '@/contexts/OrderContext';
import { useAuth } from '@/contexts/AuthContextNew';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Package, 
  Search, 
  Filter, 
  Eye, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { Order, OrderStatus } from '@/types/order';

const OrdersContent = () => {
  const { user } = useAuth();
  const { state, setFilters, clearFilters, updateOrder } = useOrders();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const formatPrice = (price: number) => `₦${price.toLocaleString()}`;
  const formatDate = (date: string) => new Date(date).toLocaleDateString();

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'shipped': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'refunded': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return Clock;
      case 'confirmed': return CheckCircle;
      case 'processing': return Package;
      case 'shipped': return Truck;
      case 'delivered': return CheckCircle;
      case 'cancelled': return XCircle;
      case 'refunded': return XCircle;
      default: return Clock;
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters({ ...state.filters, search: query });
  };

  const handleStatusFilter = (status: OrderStatus | 'all') => {
    setStatusFilter(status);
    setFilters({ 
      ...state.filters, 
      status: status === 'all' ? undefined : status 
    });
  };

  const orderTabs = [
    { value: 'all', label: 'All Orders', count: state.stats.totalOrders },
    { value: 'pending', label: 'Pending', count: state.stats.pendingOrders },
    { value: 'confirmed', label: 'Confirmed', count: state.stats.confirmedOrders },
    { value: 'shipped', label: 'Shipped', count: state.stats.shippedOrders },
    { value: 'delivered', label: 'Delivered', count: state.stats.deliveredOrders },
  ];

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      setUpdatingOrderId(orderId);
      await updateOrder({ orderId, status });
      toast({
        title: 'Order updated',
        description: `Status set to ${status}.`,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update order';
      toast({
        title: 'Update failed',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const renderActions = (order: Order) => {
    const role = user?.role;
    const isBusy = state.isLoading || updatingOrderId === order.id;

    const isSeller = role === 'farmer' || role === 'supplier';
    const isBuyer = role === 'buyer';
    const isPaid = order.paymentStatus === 'paid';

    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Eye className="w-4 h-4 mr-1" />
          View
        </Button>

        {isSeller && isPaid && order.status === 'pending' && (
          <Button size="sm" disabled={isBusy} onClick={() => updateStatus(order.id, 'confirmed')}>
            Confirm
          </Button>
        )}

        {isSeller && isPaid && order.status === 'confirmed' && (
          <Button size="sm" disabled={isBusy} onClick={() => updateStatus(order.id, 'processing')}>
            Start Processing
          </Button>
        )}

        {isSeller && isPaid && order.status === 'processing' && (
          <Button size="sm" disabled={isBusy} onClick={() => updateStatus(order.id, 'shipped')}>
            <Truck className="w-4 h-4 mr-1" />
            Mark Shipped
          </Button>
        )}

        {isBuyer && isPaid && order.status === 'shipped' && (
          <Button size="sm" disabled={isBusy} onClick={() => updateStatus(order.id, 'delivered')}>
            <CheckCircle className="w-4 h-4 mr-1" />
            Confirm Delivery
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Page Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Order Management</h1>
              <p className="text-muted-foreground">
                Track and manage your orders
              </p>
            </div>
            <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
              <Package className="w-4 h-4 mr-2" />
              New Order
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{state.stats.totalOrders}</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
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
                  <p className="text-2xl font-bold">{formatPrice(state.stats.totalRevenue)}</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Avg Order Value</p>
                  <p className="text-2xl font-bold">{formatPrice(state.stats.averageOrderValue)}</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Delivered</p>
                  <p className="text-2xl font-bold">{state.stats.deliveredOrders}</p>
                </div>
                <div className="p-3 rounded-lg bg-green-100 text-green-600">
                  <CheckCircle className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search orders by number or buyer name..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={(value) => handleStatusFilter(value)}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            {orderTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-2">
                {tab.label}
                <Badge variant="secondary">{tab.count}</Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {state.filteredOrders.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No orders found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery || statusFilter !== 'all' 
                      ? 'Try adjusting your search criteria'
                      : 'You haven\'t placed any orders yet'
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {state.filteredOrders.map((order) => {
                  const StatusIcon = getStatusIcon(order.status);
                  return (
                    <Card key={order.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg">{order.orderNumber}</h3>
                              <Badge className={`${getStatusColor(order.status)} border`}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {order.status}
                              </Badge>
                              <Badge variant="outline">
                                {order.paymentStatus}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                              <div>
                                <span className="font-medium">Buyer:</span> {order.buyerName}
                              </div>
                              <div>
                                <span className="font-medium">Date:</span> {formatDate(order.createdAt)}
                              </div>
                              <div>
                                <span className="font-medium">Total:</span> {formatPrice(order.finalAmount)}
                              </div>
                            </div>
                            <div className="mt-2">
                              <span className="text-sm text-muted-foreground">
                                {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                              </span>
                            </div>
                          </div>
                          {renderActions(order)}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Individual Status Tabs */}
          {orderTabs.slice(1).map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="space-y-4">
              {state.filteredOrders.filter(order => 
                tab.value === 'all' || order.status === tab.value
              ).length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No {tab.label.toLowerCase()} orders</h3>
                    <p className="text-muted-foreground">
                      {tab.label} orders will appear here
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {state.filteredOrders
                    .filter(order => tab.value === 'all' || order.status === tab.value)
                    .map((order) => {
                      const StatusIcon = getStatusIcon(order.status);
                      return (
                        <Card key={order.id}>
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="font-semibold text-lg">{order.orderNumber}</h3>
                                  <Badge className={`${getStatusColor(order.status)} border`}>
                                    <StatusIcon className="w-3 h-3 mr-1" />
                                    {order.status}
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                                  <div>
                                    <span className="font-medium">Buyer:</span> {order.buyerName}
                                  </div>
                                  <div>
                                    <span className="font-medium">Date:</span> {formatDate(order.createdAt)}
                                  </div>
                                  <div>
                                    <span className="font-medium">Total:</span> {formatPrice(order.finalAmount)}
                                  </div>
                                </div>
                              </div>
                              {renderActions(order)}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

const Orders = () => {
  return (
    <OrderProvider>
      <OrdersContent />
    </OrderProvider>
  );
};

export default Orders;
