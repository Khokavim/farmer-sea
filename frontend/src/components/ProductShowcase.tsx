import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeroButton } from "@/components/ui/hero-button";
import { MapPin, Calendar, TrendingUp } from "lucide-react";
import josFarmerImage from "@/assets/jos-farmer-potatoes.jpg";

const ProductShowcase = () => {
  const featuredProducts = [
    {
      name: "Jos Irish Potatoes",
      location: "Jos North LGA, Plateau State",
      price: "₦450/kg",
      quantity: "50 tonnes",
      harvest: "Available Now",
      quality: "Grade A",
      farmer: "Plateau Farmers Cooperative",
      image: josFarmerImage,
      trending: true
    },
    {
      name: "Fresh Tomatoes",
      location: "Kaduna State",
      price: "₦280/kg", 
      quantity: "30 tonnes",
      harvest: "Next Week",
      quality: "Grade A",
      farmer: "Northern Agro Suppliers",
      image: "/placeholder.svg",
      trending: false
    },
    {
      name: "Sweet Plantains",
      location: "Ogun State",
      price: "₦320/kg",
      quantity: "20 tonnes", 
      harvest: "Available Now",
      quality: "Grade A+",
      farmer: "Southwest Fresh Produce",
      image: "/placeholder.svg",
      trending: true
    }
  ];

  return (
    <section className="pt-2 pb-12 lg:pt-4 lg:pb-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-4">
            <TrendingUp className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">Fresh From Our Farms</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Premium Nigerian Produce
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover high-quality, locally sourced produce from verified farmers across Nigeria. 
            Starting with our Jos hub for the freshest potatoes and vegetables.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-border/50">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.trending && (
                  <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
                    Trending
                  </Badge>
                )}
                <Badge variant="secondary" className="absolute top-3 right-3 bg-background/90 text-foreground">
                  {product.quality}
                </Badge>
              </div>
              
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {product.location}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold text-primary">
                      {product.price}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {product.quantity} available
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {product.harvest}
                  </div>

                  <div className="pt-2 border-t border-border">
                    <div className="text-xs text-muted-foreground">
                      Supplied by: <span className="font-medium text-foreground">{product.farmer}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ProductShowcase;