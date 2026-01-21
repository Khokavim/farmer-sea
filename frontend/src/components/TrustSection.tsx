import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Truck, CreditCard, Award, Clock, Users } from "lucide-react";

const TrustSection = () => {
  const trustFeatures = [
    {
      icon: Shield,
      title: "Verified Suppliers",
      description: "All farmers and suppliers undergo strict verification to ensure quality and reliability.",
      stats: "500+ Verified"
    },
    {
      icon: Truck,
      title: "Reliable Logistics",
      description: "Cold-chain transportation ensures fresh delivery from Jos to anywhere in Nigeria.",
      stats: "99% On-time"
    },
    {
      icon: CreditCard,
      title: "Secure Payments",
      description: "Escrow-protected transactions via Flutterwave and Paystack. Funds released only after delivery confirmation.",
      stats: "₦50M+ Secured"
    },
    {
      icon: Award,
      title: "Quality Guarantee",
      description: "Grade A+ produce with quality inspections at source. Full refund if not satisfied.",
      stats: "Grade A+"
    },
    {
      icon: Clock,
      title: "Real-time Tracking",
      description: "Monitor your orders from farm to delivery with SMS/WhatsApp updates and GPS tracking.",
      stats: "Live Updates"
    },
    {
      icon: Users,
      title: "Expert Support",
      description: "Dedicated customer success team available to resolve disputes and ensure smooth transactions.",
      stats: "24/7 Support"
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 bg-success/10 text-success border-success/20">
            Trusted by 1000+ Businesses
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Why Nigerian Businesses Trust Farmer Sea
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We've built the most reliable farm-to-business platform in Nigeria, ensuring quality, 
            security, and transparency at every step of your supply chain.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trustFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-border/50 gradient-card">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <Badge variant="outline" className="text-xs bg-accent/10 text-accent border-accent/20">
                        {feature.stats}
                      </Badge>
                    </div>
                    
                    <div>
                      <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default TrustSection;