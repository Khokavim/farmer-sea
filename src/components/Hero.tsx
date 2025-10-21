import { HeroButton } from "@/components/ui/hero-button";
import { ArrowRight, Truck, Shield, Users } from "lucide-react";
import heroImage from "@/assets/nigerian-produce-hero.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Fresh Nigerian produce"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm border border-accent/30 rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-primary-foreground">
                Pilot Launch: Jos → Nationwide
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
              Connect Nigerian
              <span className="text-accent block">Farms to Business</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl lg:text-2xl text-primary-foreground/90 mb-8 max-w-2xl">
              Streamline your supply chain from Jos farms to restaurants, hotels, and supermarkets nationwide. 
              Fresh produce, reliable delivery, transparent pricing.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <HeroButton size="lg" variant="accent" className="group">
                Browse Marketplace
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </HeroButton>
              <HeroButton size="lg" variant="outline" className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Join as Supplier
              </HeroButton>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl">
              <div className="flex items-center gap-3 text-primary-foreground/80">
                <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <div className="font-semibold">500+ Farmers</div>
                  <div className="text-sm opacity-75">Verified Suppliers</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-primary-foreground/80">
                <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                  <Truck className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <div className="font-semibold">24hr Delivery</div>
                  <div className="text-sm opacity-75">Jos to Anywhere</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-primary-foreground/80">
                <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <div className="font-semibold">Secure Payments</div>
                  <div className="text-sm opacity-75">Escrow Protected</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-10 w-20 h-20 bg-accent/20 rounded-full animate-float hidden lg:block"></div>
      <div className="absolute bottom-20 left-10 w-16 h-16 bg-primary/20 rounded-full animate-float animation-delay-2000 hidden lg:block"></div>
    </section>
  );
};

export default Hero;