import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">Terms of Service</h1>
          <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
            <p className="text-sm text-muted-foreground">Last updated: January 1, 2025</p>
            
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Farmer Sea Nigeria's platform, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Description of Service</h2>
              <p>
                Farmer Sea Nigeria is a farm-to-business wholesale platform that connects Nigerian farmers and food processors to restaurants, hotels, and supermarkets nationwide. Our services include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Online marketplace for wholesale agricultural products</li>
                <li>Logistics and delivery coordination</li>
                <li>Payment processing and escrow services</li>
                <li>Quality assurance and verification</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. User Responsibilities</h2>
              <p>As a user of our platform, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate and truthful information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Respect the rights of other users</li>
                <li>Use the platform only for legitimate business purposes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Prohibited Activities</h2>
              <p>Users are prohibited from:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Posting false or misleading product information</li>
                <li>Engaging in fraudulent activities</li>
                <li>Violating intellectual property rights</li>
                <li>Disrupting the platform's operation</li>
                <li>Selling prohibited or illegal items</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Payment Terms</h2>
              <p>
                All transactions are subject to our payment terms. We use secure payment processing and escrow services to protect both buyers and sellers. Payment disputes will be handled according to our dispute resolution process.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Limitation of Liability</h2>
              <p>
                Farmer Sea Nigeria shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Termination</h2>
              <p>
                We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Contact Information</h2>
              <p>
                Questions about the Terms of Service should be sent to us at:
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <p>Email: hello@farmersea.ng</p>
                <p>Phone: +234 (0) 8069919304</p>
                <p>Address: Jos, Plateau State, Nigeria</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;