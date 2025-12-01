import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Hero,
  Demo,
  Features,
  Mockups,
  Testimonials,
  HowItWorks,
} from "@/components/decorative";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, Home as HomeIcon, PartyPopper } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <Hero />

      <section className="py-16 md:py-20 lg:py-24 bg-background relative border-b border-border/50">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
                10K+
              </div>
              <div className="text-sm text-muted-foreground">
                Expenses Tracked
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
                500+
              </div>
              <div className="text-sm text-muted-foreground">
                Trips Organized
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
                2K+
              </div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
                99%
              </div>
              <div className="text-sm text-muted-foreground">
                Satisfaction Rate
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="border-b border-border/50">
        <Features />
      </div>

      <Demo />

      <div className="">
        <HowItWorks />
      </div>

      <div className="border-b border-border/50">
        <Mockups />
      </div>

      <div className="border-b border-border/50">
        <Testimonials />
      </div>

      <section className="py-20 md:py-28 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              Everything you need to know about TripSplit
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-6">
            <Card className="border-none shadow-soft hover:shadow-md transition-all">
              <CardHeader>
                <CardTitle className="text-lg">
                  Is TripSplit free to use?
                </CardTitle>
                <CardDescription className="text-base">
                  Yes! TripSplit is completely free to use. Track unlimited
                  expenses and trips with no hidden fees.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-none shadow-soft hover:shadow-md transition-all">
              <CardHeader>
                <CardTitle className="text-lg">
                  How does the settlement algorithm work?
                </CardTitle>
                <CardDescription className="text-base">
                  Our smart algorithm calculates the minimum number of
                  transactions needed to balance everyone's debts, making
                  settlements simple and efficient.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-none shadow-soft hover:shadow-md transition-all">
              <CardHeader>
                <CardTitle className="text-lg">
                  Can I use TripSplit offline?
                </CardTitle>
                <CardDescription className="text-base">
                  You need an internet connection to sync data, but you can view
                  your existing trips and expenses offline.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-none shadow-soft hover:shadow-md transition-all">
              <CardHeader>
                <CardTitle className="text-lg">
                  How do I invite friends to a trip?
                </CardTitle>
                <CardDescription className="text-base">
                  Simply create a trip and add members by their email or
                  username. They'll receive a notification to join.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-none shadow-soft hover:shadow-md transition-all">
              <CardHeader>
                <CardTitle className="text-lg">
                  Is my financial data secure?
                </CardTitle>
                <CardDescription className="text-base">
                  Absolutely. We use industry-standard encryption to protect
                  your data. We never store payment information or share your
                  data with third parties.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
