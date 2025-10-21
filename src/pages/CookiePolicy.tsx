import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">Cookie Policy</h1>
          <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
            <p className="text-sm text-muted-foreground">Last updated: January 1, 2025</p>
            
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. What Are Cookies</h2>
              <p>
                Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. How We Use Cookies</h2>
              <p>Farmer Sea Nigeria uses cookies for several purposes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
                <li><strong>Performance Cookies:</strong> Help us understand how visitors interact with our website</li>
                <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                <li><strong>Authentication Cookies:</strong> Keep you logged in to your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Types of Cookies We Use</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Strictly Necessary Cookies</h3>
                  <p>These cookies are essential for the website to function and cannot be switched off. They include:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Session management cookies</li>
                    <li>Security cookies</li>
                    <li>Authentication tokens</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Analytics Cookies</h3>
                  <p>These cookies help us understand how visitors use our website by collecting anonymous information about:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Page views and user journeys</li>
                    <li>Time spent on pages</li>
                    <li>Traffic sources</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Functional Cookies</h3>
                  <p>These cookies enhance functionality and personalization:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Language preferences</li>
                    <li>User interface customizations</li>
                    <li>Shopping cart contents</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Third-Party Cookies</h2>
              <p>
                We may use third-party services that set cookies on our website, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Payment processors for secure transactions</li>
                <li>Analytics services to understand user behavior</li>
                <li>Customer support tools</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Managing Cookies</h2>
              <p>
                You can control and manage cookies in various ways. Please note that removing or blocking cookies can impact your user experience and parts of our website may no longer be fully accessible.
              </p>
              
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">Browser Settings</h4>
                <p>Most browsers allow you to:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>View what cookies are stored and delete them individually</li>
                  <li>Block third-party cookies</li>
                  <li>Block cookies from particular sites</li>
                  <li>Delete all cookies when you close your browser</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Changes to This Policy</h2>
              <p>
                We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Contact Us</h2>
              <p>
                If you have any questions about our use of cookies, please contact us:
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

export default CookiePolicy;