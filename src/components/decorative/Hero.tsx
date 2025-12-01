import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/lib/toast";

const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative pt-24 pb-16 md:pt-32 lg:pt-48 md:pb-24 lg:pb-32 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-primary/20 rounded-full blur-3xl -z-10 opacity-60"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-blue-100 dark:bg-blue-900/30 rounded-full blur-3xl -z-10 opacity-60"></div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          <div className="space-y-6 md:space-y-8 max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Simple. Fast. Free.
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-900 dark:text-foreground leading-tight">
              Split expenses, <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                not friendships.
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-muted-foreground leading-relaxed max-w-lg mx-auto lg:mx-0">
              The easiest way to manually track shared bills directly in your
              browser. No downloads required—just add expenses and we handle the
              math.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                onClick={() => {
                  toast.info(
                    "Coming Soon!",
                    "Dashboard feature is under development"
                  );
                  navigate("/dashboard");
                }}
                className="w-full sm:w-auto"
              >
                Launch Web App <ArrowRight size={20} />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  document
                    .getElementById("demo")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full sm:w-auto"
              >
                View Demo
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-6 text-xs sm:text-sm text-gray-500 dark:text-muted-foreground font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-primary flex-shrink-0" />
                <span>Free for everyone</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-primary flex-shrink-0" />
                <span>Works on any device</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-primary flex-shrink-0" />
                <span>No hidden fees</span>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
            {/* Browser Window Composition */}
            <div className="relative z-10 w-full max-w-[600px] mx-auto bg-white dark:bg-card rounded-lg shadow-2xl border border-gray-200 dark:border-border overflow-hidden transform rotate-[-2deg] hover:rotate-0 transition-all duration-500">
              {/* Browser Header */}
              <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 flex items-center gap-4 border-b border-gray-200 dark:border-border">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="flex-1 bg-white dark:bg-gray-900 rounded-md px-3 py-1 text-xs text-center text-gray-500 dark:text-muted-foreground font-mono">
                  tripsplit.com/dashboard/paris-2024
                </div>
              </div>

              {/* Browser Content */}
              <div className="flex h-[400px]">
                {/* Sidebar */}
                <div className="w-48 bg-gray-50 dark:bg-gray-900 border-r border-gray-100 dark:border-border p-4 hidden sm:block">
                  <div className="font-bold text-gray-800 dark:text-foreground mb-6 text-left">
                    My Groups
                  </div>
                  <div className="space-y-2">
                    <div className="bg-primary/10 text-primary px-3 py-2 rounded-lg text-sm font-medium text-left">
                      🇫🇷 Paris Trip
                    </div>
                    <div className="text-gray-600 dark:text-muted-foreground px-3 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 text-left">
                      🏠 House Rent
                    </div>
                    <div className="text-gray-600 dark:text-muted-foreground px-3 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 text-left">
                      🍕 Friday Pizza
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6 bg-white dark:bg-card overflow-hidden relative">
                  <div className="flex justify-between items-start mb-6">
                    <div className="text-left">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-foreground">
                        Paris Trip 🇫🇷
                      </h2>
                      <p className="text-gray-500 dark:text-muted-foreground text-sm">
                        Oct 12 - Oct 18 • 4 people
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs text-gray-500 dark:text-muted-foreground uppercase">
                        Total Expenses
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-foreground">
                        $1,240.50
                      </div>
                    </div>
                  </div>

                  {/* Expense List */}
                  <div className="space-y-3">
                    {[
                      {
                        title: "Dinner at LouLou",
                        payer: "You paid $145.00",
                        date: "Oct 14",
                        icon: "🍷",
                      },
                      {
                        title: "Eiffel Tower Tickets",
                        payer: "Alice paid $85.00",
                        date: "Oct 13",
                        icon: "🎟️",
                      },
                      {
                        title: "Uber from Airport",
                        payer: "Bob paid $45.00",
                        date: "Oct 12",
                        icon: "🚕",
                      },
                      {
                        title: "Croissants & Coffee",
                        payer: "You paid $24.00",
                        date: "Oct 12",
                        icon: "🥐",
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-border hover:border-primary/30 hover:bg-primary/5 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-xl flex-shrink-0">
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <div className="font-semibold text-gray-900 dark:text-foreground text-sm truncate">
                            {item.title}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-muted-foreground truncate">
                            {item.payer}
                          </div>
                        </div>
                        <div className="text-xs text-gray-400 dark:text-muted-foreground font-mono flex-shrink-0">
                          {item.date}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Button */}
                  <div className="absolute bottom-6 right-6">
                    <button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-4 shadow-lg shadow-primary/30 transition-all hover:scale-105">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements behind */}
            <div className="absolute top-12 -right-4 w-[600px] h-[400px] bg-primary/5 rounded-3xl -z-10 rotate-3"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
