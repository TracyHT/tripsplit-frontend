import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  DollarSign,
  TrendingUp,
  Receipt,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16 md:pt-20 mt-4">
        <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
              <Receipt className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Simple. Fair. Stress-free.
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
              Split Bills with Friends, Not Friendships
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Track shared expenses on trips and events. Know who owes what.
              Settle up easily.
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/dashboard")}
              className="shadow-colored hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Features Grid */}
          <div
            id="features"
            className="grid md:grid-cols-3 gap-6 mt-20 max-w-5xl mx-auto"
          >
            <Card className="border-none shadow-soft hover:shadow-colored transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <Users className="w-10 h-10 text-primary mb-4" />
                <CardTitle>Group Tracking</CardTitle>
                <CardDescription>
                  Add friends, track who paid, and split costs fairly among
                  everyone.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-none shadow-soft hover:shadow-colored transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <DollarSign className="w-10 h-10 text-primary mb-4" />
                <CardTitle>Smart Calculations</CardTitle>
                <CardDescription>
                  Automatically calculate who owes whom with minimal
                  transactions needed.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-none shadow-soft hover:shadow-colored transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <TrendingUp className="w-10 h-10 text-primary mb-4" />
                <CardTitle>Real-time Balances</CardTitle>
                <CardDescription>
                  See balances update instantly as you add expenses. No
                  surprises.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground">
              Three simple steps to split expenses fairly
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto">
                1
              </div>
              <h3 className="text-xl font-semibold">Create a Trip</h3>
              <p className="text-muted-foreground">
                Start by creating a trip and adding all the participants who'll
                share expenses.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto">
                2
              </div>
              <h3 className="text-xl font-semibold">Add Expenses</h3>
              <p className="text-muted-foreground">
                Log each expense with who paid and who should split the cost.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto">
                3
              </div>
              <h3 className="text-xl font-semibold">Settle Up</h3>
              <p className="text-muted-foreground">
                View smart settlement suggestions showing who owes whom the
                minimal amount.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto text-center shadow-colored border-none bg-gradient-primary p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Split Smarter?
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-8">
              Start tracking your group expenses today
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate("/dashboard")}
              className="shadow-soft"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
