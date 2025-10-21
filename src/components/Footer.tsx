import { Leaf, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-accent-foreground" />
                </div>
                <span className="font-bold text-xl">Farmer Sea</span>
              </div>
              <p className="text-primary-foreground/80 text-sm leading-relaxed">
                Connecting Nigerian farms to businesses nationwide. 
                Fresh produce, reliable delivery, transparent pricing.
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  Get Started
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Platform</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Home</a></li>
                <li><a href="/marketplace" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Marketplace</a></li>
                <li><a href="/about" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">About Us</a></li>
                <li><a href="/contact" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Contact</a></li>
                <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">For Farmers</a></li>
                <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">For Businesses</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Quality Guarantee</a></li>
                <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Payment Issues</a></li>
                <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Track Orders</a></li>
                <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Contact Us</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Contact</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-accent" />
                  <span className="text-primary-foreground/80">Jos, Plateau State</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-accent" />
                  <span className="text-primary-foreground/80">+234 (0) 8069919304</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-accent" />
                  <span className="text-primary-foreground/80">hello@farmersea.ng</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-primary-foreground/20 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <div className="text-primary-foreground/80">
              © 2025 Farmer Sea Nigeria. All rights reserved.
            </div>
            <div className="flex gap-6">
              <a href="/privacy-policy" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="/terms-of-service" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Terms of Service
              </a>
              <a href="/cookie-policy" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;