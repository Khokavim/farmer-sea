import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Eye, 
  Edit, 
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3,
  Settings
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContextNew';

const AdminDashboard = () => {
  const { user } = useAuth();

  // Mock data for admin dashboard
  const stats = [
    { label: 'Total Users', value: '1,247', icon: Users, color: 'text-blue-600' },
    { label: 'Platform Revenue', value: '₦12.5M', icon: DollarSign, color: 'text-green-600' },
    { label: 'Active Orders', value: '156', icon: TrendingUp, color: 'text-purple-600' },
    { label: 'Pending Verifications', value: '23', icon: AlertTriangle, color: 'text-orange-600' },
  ];

  const pendingVerifications = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'farmer',
      businessName: 'Plateau Farmers Cooperative',
      location: 'Jos, Plateau State',
      submittedAt: '2025-01-15',
      status: 'pending'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'supplier',
      businessName: 'Northern Agro Suppliers',
      location: 'Kaduna State',
      submittedAt: '2025-01-14',
      status: 'pending'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      role: 'buyer',
      businessName: 'Lagos Restaurant Chain',
      location: 'Lagos State',
      submittedAt: '2025-01-13',
      status: 'pending'
    }
  ];

  const recentUsers = [
    {
      id: 1,
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      role: 'farmer',
      status: 'verified',
      joinedAt: '2025-01-15',
      lastActive: '2025-01-15'
    },
    {
      id: 2,
      name: 'David Brown',
      email: 'david@example.com',
      role: 'supplier',
      status: 'verified',
      joinedAt: '2025-01-14',
      lastActive: '2025-01-14'
    },
    {
      id: 3,
      name: 'Lisa Davis',
      email: 'lisa@example.com',
      role: 'buyer',
      status: 'pending',
      joinedAt: '2025-01-13',
      lastActive: '2025-01-13'
    }
  ];

  const platformMetrics = [
    { label: 'Total Transactions', value: '₦45.2M', change: '+12%' },
    { label: 'Average Order Value', value: '₦289,000', change: '+8%' },
    { label: 'User Growth Rate', value: '23%', change: '+5%' },
    { label: 'Platform Fee Revenue', value: '₦2.3M', change: '+15%' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {user?.name}! Manage the Farmer Sea platform.
              </p>
            </div>
            <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
              <Settings className="w-4 h-4 mr-2" />
              Platform Settings
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
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="verifications">Verifications</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Metrics</CardTitle>
                  <CardDescription>
                    Key performance indicators for the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {platformMetrics.map((metric, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">{metric.label}</p>
                          <p className="text-2xl font-bold">{metric.value}</p>
                        </div>
                        <Badge variant="default" className="text-green-600">
                          {metric.change}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest platform activities and events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New user registration</p>
                        <p className="text-xs text-muted-foreground">Sarah Wilson joined as a farmer</p>
                      </div>
                      <span className="text-xs text-muted-foreground">2 hours ago</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Large order placed</p>
                        <p className="text-xs text-muted-foreground">₦2.5M order for Jos Irish Potatoes</p>
                      </div>
                      <span className="text-xs text-muted-foreground">4 hours ago</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Payment dispute resolved</p>
                        <p className="text-xs text-muted-foreground">Order #ORD-001 dispute closed</p>
                      </div>
                      <span className="text-xs text-muted-foreground">6 hours ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage platform users and their accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{user.name}</h3>
                          <Badge variant={user.status === 'verified' ? 'default' : 'secondary'}>
                            {user.status}
                          </Badge>
                          <Badge variant="outline" className="capitalize">{user.role}</Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>{user.email}</span>
                          <span>Joined: {user.joinedAt}</span>
                          <span>Last active: {user.lastActive}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        {user.status === 'pending' && (
                          <Button size="sm">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Verify
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Verifications Tab */}
          <TabsContent value="verifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Verifications</CardTitle>
                <CardDescription>
                  Review and approve user verification requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingVerifications.map((verification) => (
                    <div key={verification.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{verification.name}</h3>
                          <Badge variant="secondary" className="capitalize">{verification.role}</Badge>
                          <Badge variant="outline">Pending</Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>{verification.email}</span>
                          <span>Business: {verification.businessName}</span>
                          <span>Location: {verification.location}</span>
                          <span>Submitted: {verification.submittedAt}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button variant="destructive" size="sm">
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
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
                  <CardTitle>Revenue Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Revenue chart will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">User growth chart will be displayed here</p>
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

export default AdminDashboard;
