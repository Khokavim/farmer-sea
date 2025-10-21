import Header from "@/components/Header";
import Hero from "@/components/Hero";
import UserTypeSelector from "@/components/UserTypeSelector";
import ProductShowcase from "@/components/ProductShowcase";
import TrustSection from "@/components/TrustSection";
import Footer from "@/components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <UserTypeSelector />
      <ProductShowcase />
      <TrustSection />
      <Footer />
    </div>
  );
};

export default Home;

