import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HeroButton } from "@/components/ui/hero-button";
import { Tractor, Building2, Store, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserTypeSelector = () => {
  const navigate = useNavigate();
  
  const handleGetStarted = (userType: string) => {
    navigate('/auth', { state: { defaultRole: userType } });
  };

  const userTypes = [
    {
      type: "farmer",
      title: "I'm a Farmer/Food Processor",
      description: "List your produce, connect with buyers, and grow your business",
      icon: Tractor,
      features: ["Upload harvest calendar", "Set competitive prices", "Direct buyer access", "SMS/USSD support"],
      color: "primary"
    },
    {
      type: "supplier",
      title: "I'm a Supplier/Aggregator",
      description: "Pool farmer produce and supply businesses at scale",
      icon: Building2,
      features: ["Bulk inventory management", "Quality certifications", "Logistics coordination", "B2B marketplace"],
      color: "accent"
    },
    {
      type: "buyer",
      title: "I'm a Business Buyer",
      description: "Source fresh produce for your restaurant, hotel, or store",
      icon: Store,
      features: ["Browse verified suppliers", "Place bulk orders", "Track deliveries", "Secure payments"],
      color: "success"
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Join Nigeria's Largest Farm-to-Business Network
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you're growing, aggregating, or buying fresh produce, we've built the perfect platform for your needs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {userTypes.map((userType) => {
            const Icon = userType.icon;
            return (
              <Card key={userType.type} className="group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 gradient-card border-border/50">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground">
                    {userType.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {userType.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {userType.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <HeroButton 
                    className="w-full group mt-6" 
                    variant={userType.color === "primary" ? "default" : userType.color === "accent" ? "accent" : "default"}
                    onClick={() => handleGetStarted(userType.type)}
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </HeroButton>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UserTypeSelector;