import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Leaf } from 'lucide-react';

const Auth = () => {
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user came from account type selection
  useEffect(() => {
    const state = location.state as { defaultRole?: string };
    if (state?.defaultRole) {
      setActiveTab('signup');
    }
  }, [location.state]);

  const handleAuthSuccess = () => {
    navigate('/dashboard');
  };

  const switchToSignup = () => setActiveTab('signup');
  const switchToLogin = () => setActiveTab('login');

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <Header />
      <div className="flex items-center justify-center p-4 min-h-[calc(100vh-4rem)]">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Leaf className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-bold text-2xl text-primary">Farmer Sea</span>
            </div>
            <p className="text-muted-foreground">
              Connect Nigerian farms to business
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="mt-6">
              <LoginForm 
                onSuccess={handleAuthSuccess}
                onSwitchToSignup={switchToSignup}
              />
            </TabsContent>
            
            <TabsContent value="signup" className="mt-6">
              <SignupForm 
                onSuccess={handleAuthSuccess}
                onSwitchToLogin={switchToLogin}
                defaultRole={(location.state as { defaultRole?: string })?.defaultRole}
              />
            </TabsContent>
          </Tabs>

          {/* Test Credentials */}
          <Card className="mt-6 bg-muted/50">
            <CardContent className="p-4">
              <h4 className="font-semibold text-sm mb-2">Test Credentials</h4>
              <div className="text-xs text-muted-foreground space-y-1">
                <p><strong>Email:</strong> admin@farmersea.com</p>
                <p><strong>Password:</strong> admin123</p>
                <p className="text-xs text-muted-foreground/70 mt-2">
                  This is a real account from the database
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Auth;