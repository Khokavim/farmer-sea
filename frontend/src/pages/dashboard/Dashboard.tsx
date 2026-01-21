import { useAuth } from '@/contexts/AuthContextNew';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Package, 
  MessageSquare, 
  ShoppingCart, 
  Users, 
  DollarSign,
  ArrowRight,
  Calendar,
  MapPin,
  Star,
  Activity,
  BarChart3,
  Zap,
  Shield,
  Heart,
  Globe,
  Truck,
  Award,
  Target,
  Sparkles,
  Leaf,
  Sun,
  CloudRain
} from 'lucide-react';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-4 text-foreground">Loading Dashboard...</h2>
          <p className="text-muted-foreground">Please wait while we load your dashboard.</p>
        </div>
      </div>
    );
  }

  // Enhanced stats with more realistic data
  const stats = [
    { 
      label: 'Total Orders', 
      value: '24', 
      change: '+12%',
      icon: Package, 
      color: 'text-blue-600', 
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      borderColor: 'border-blue-200'
    },
    { 
      label: 'Active Listings', 
      value: '8', 
      change: '+3',
      icon: TrendingUp, 
      color: 'text-green-600', 
      bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
      borderColor: 'border-green-200'
    },
    { 
      label: 'Monthly Revenue', 
      value: '₦245,000', 
      change: '+18%',
      icon: DollarSign, 
      color: 'text-purple-600', 
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
      borderColor: 'border-purple-200'
    },
    { 
      label: 'Messages', 
      value: '12', 
      change: '+5',
      icon: MessageSquare, 
      color: 'text-orange-600', 
      bgColor: 'bg-gradient-to-br from-orange-50 to-orange-100',
      borderColor: 'border-orange-200'
    },
  ];

  const quickActions = [
    {
      title: 'Browse Marketplace',
      description: 'Discover fresh produce from local farmers',
      icon: ShoppingCart,
      href: '/marketplace',
      color: 'bg-gradient-to-br from-emerald-500 to-teal-600',
      textColor: 'text-white',
      iconBg: 'bg-white/20'
    },
    {
      title: 'View Orders',
      description: 'Track your orders and deliveries',
      icon: Package,
      href: '/orders',
      color: 'bg-gradient-to-br from-blue-500 to-cyan-600',
      textColor: 'text-white',
      iconBg: 'bg-white/20'
    },
    {
      title: 'Messages',
      description: 'Connect with farmers and buyers',
      icon: MessageSquare,
      href: '/messages',
      color: 'bg-gradient-to-br from-purple-500 to-pink-600',
      textColor: 'text-white',
      iconBg: 'bg-white/20'
    },
    {
      title: 'Profile Settings',
      description: 'Manage your account settings',
      icon: Users,
      href: '/profile',
      color: 'bg-gradient-to-br from-orange-500 to-red-600',
      textColor: 'text-white',
      iconBg: 'bg-white/20'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'order',
      title: 'New order received',
      description: 'Order #FS-2024-001 for 5kg Fresh Tomatoes',
      time: '2 hours ago',
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 2,
      type: 'message',
      title: 'New message from John Doe',
      description: 'Interested in your organic carrots',
      time: '4 hours ago',
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 3,
      type: 'listing',
      title: 'Product listing updated',
      description: 'Fresh Onions - Stock updated to 200kg',
      time: '6 hours ago',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'farmer': return <Leaf className="w-5 h-5" />;
      case 'supplier': return <Truck className="w-5 h-5" />;
      case 'buyer': return <ShoppingCart className="w-5 h-5" />;
      case 'admin': return <Shield className="w-5 h-5" />;
      default: return <Users className="w-5 h-5" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'farmer': return 'text-green-600 bg-green-50 border-green-200';
      case 'supplier': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'buyer': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'admin': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/5 to-transparent"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-accent/20 to-transparent rounded-full blur-3xl"></div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-4xl mx-auto">
            {/* Welcome Header */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-primary/20 rounded-full px-6 py-3 mb-6 shadow-lg">
                <Activity className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Welcome back, {user.name}!
                </span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6">
                Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">Dashboard</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Manage your {user.role} activities and grow your agricultural business with Farmer Sea
              </p>

              {/* User Info Badge */}
              <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-primary/20 rounded-full px-6 py-3 shadow-lg">
                <div className={`p-2 rounded-full ${getRoleColor(user.role)}`}>
                  {getRoleIcon(user.role)}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-foreground capitalize">{user.role}</p>
                  <p className="text-sm text-muted-foreground">{user.businessName || 'Individual Account'}</p>
                </div>
                <Badge variant="secondary" className="ml-2">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Card key={index} className={`${stat.bgColor} ${stat.borderColor} border-2 hover:shadow-lg transition-all duration-300 hover:scale-105`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bgColor} ${stat.borderColor} border`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-green-600 font-medium">{stat.change}</p>
                  </div>
                </div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border-0">
                <CardContent className="p-0">
                  <div className={`${action.color} p-6 rounded-lg text-center group-hover:shadow-lg transition-all duration-300`}>
                    <div className={`${action.iconBg} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <action.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className={`text-lg font-semibold ${action.textColor} mb-2`}>{action.title}</h3>
                    <p className={`text-sm ${action.textColor} opacity-90 mb-4`}>{action.description}</p>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                      onClick={() => navigate(action.href)}
                    >
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Get Started
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Recent Activity</h2>
          </div>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors duration-200">
                    <div className={`p-3 rounded-full ${activity.bgColor}`}>
                      <activity.icon className={`w-5 h-5 ${activity.color}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{activity.title}</h4>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">{activity.time}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sales Chart Placeholder */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-primary" />
                <div>
                  <CardTitle className="text-xl">Performance Overview</CardTitle>
                  <CardDescription>Your business metrics this month</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg border-2 border-dashed border-primary/20">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-primary/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">Performance chart will be displayed here</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weather & Market Info */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Sun className="w-6 h-6 text-yellow-500" />
                <div>
                  <CardTitle className="text-xl">Market Conditions</CardTitle>
                  <CardDescription>Today's agricultural insights</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-3">
                    <Sun className="w-6 h-6 text-yellow-600" />
                    <div>
                      <p className="font-semibold text-foreground">Weather</p>
                      <p className="text-sm text-muted-foreground">Perfect for harvesting</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-yellow-600">28°C</p>
                    <p className="text-sm text-muted-foreground">Sunny</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-semibold text-foreground">Market Price</p>
                      <p className="text-sm text-muted-foreground">Tomatoes trending up</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">+12%</p>
                    <p className="text-sm text-muted-foreground">This week</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;