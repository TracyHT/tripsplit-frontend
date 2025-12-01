import React from "react";
import { Share2, Users, Calculator, BarChart3, Receipt } from "lucide-react";

const Features: React.FC = () => {
  const features = [
    {
      title: "Easy Expense Splitting",
      description:
        "Split bills equally, by exact amounts, or percentages. We handle the complex math instantly.",
      icon: Share2,
      className: "md:col-span-2",
      visual: (
        <div className="mt-4 p-4 md:p-6 bg-card border-t border-border/70 rounded-t-2xl md:rounded-t-3xl">
          <div className="flex justify-between text-xs md:text-sm font-medium mb-3 text-muted-foreground">
            <span>You (50%)</span>
            <span>Alex (25%)</span>
            <span>Sam (25%)</span>
          </div>
          <div className="flex h-5 md:h-6 rounded-full overflow-hidden w-full mb-4 md:mb-5 ring-2 md:ring-4 ring-muted">
            <div className="w-1/2 bg-gradient-to-r from-cyan-500 to-cyan-600 flex items-center justify-center text-[9px] md:text-[10px] text-white font-bold">
              50%
            </div>
            <div className="w-1/4 bg-cyan-400 flex items-center justify-center text-[9px] md:text-[10px] text-white font-bold">
              25%
            </div>
            <div className="w-1/4 bg-cyan-300 flex items-center justify-center text-[9px] md:text-[10px] text-white font-bold">
              25%
            </div>
          </div>
          <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <div className="px-3 md:px-4 py-1 md:py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-[10px] md:text-xs font-bold whitespace-nowrap">
              Equal Split
            </div>
            <div className="px-3 md:px-4 py-1 md:py-1.5 rounded-full border border-border text-muted-foreground text-[10px] md:text-xs font-medium whitespace-nowrap">
              Exact Amount
            </div>
            <div className="px-3 md:px-4 py-1 md:py-1.5 rounded-full border border-border text-muted-foreground text-[10px] md:text-xs font-medium whitespace-nowrap">
              % Percent
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Group Management",
      description:
        "Create trips with multiple participants and keep everyone in sync.",
      icon: Users,
      className: "md:col-span-1 md:row-span-1",
      gradient: "from-blue-500 to-indigo-500",
      visual: (
        <div className=" p-4 md:p-5 flex items-start">
          <div className="flex -space-x-2 md:-space-x-3">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 border-2 border-card flex items-center justify-center text-white text-[10px] md:text-xs font-bold shadow-md group-hover:scale-110 transition-transform duration-300">
              You
            </div>
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-card flex items-center justify-center text-white text-[10px] md:text-xs font-bold shadow-md group-hover:scale-110 transition-transform duration-300 delay-75">
              AL
            </div>
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-card flex items-center justify-center text-white text-[10px] md:text-xs font-bold shadow-md group-hover:scale-110 transition-transform duration-300 delay-150">
              SM
            </div>
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 border-2 border-card flex items-center justify-center text-white text-[10px] md:text-xs font-bold shadow-md group-hover:scale-110 transition-transform duration-300 delay-200">
              +3
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Expense History",
      description: "Complete record of all expenses with dates and details.",
      icon: Receipt,
      className: "md:col-span-1 md:row-span-1",
      gradient: "from-orange-500 to-red-500",
      visual: (
        <div className=" px-4 md:px-5 pb-4 md:pb-5 space-y-2">
          <div className="flex items-center justify-between p-2 md:p-3 bg-card rounded-lg md:rounded-xl shadow-sm border border-border text-xs md:text-sm transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-orange-500/10 text-accent flex items-center justify-center text-sm md:text-base">
                🍔
              </div>
              <span className="font-semibold text-foreground">Dinner</span>
            </div>
            <span className="font-bold text-foreground">$45</span>
          </div>
          <div className="flex items-center justify-between p-2 md:p-3 bg-card rounded-lg md:rounded-xl shadow-sm border border-border text-xs md:text-sm opacity-60 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 delay-75">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-muted text-muted-foreground flex items-center justify-center text-sm md:text-base">
                🚕
              </div>
              <span className="font-semibold text-foreground">Uber</span>
            </div>
            <span className="font-bold text-foreground">$12</span>
          </div>
        </div>
      ),
    },
    {
      title: "Smart Calculations",
      description: "Minimizes transactions needed to settle up efficiently.",
      icon: Calculator,
      className: "md:col-span-1 md:row-span-1",
      gradient: "from-purple-500 to-pink-500",
      visual: (
        <div className=" p-4 md:p-5 space-y-2">
          <div className="flex items-center justify-between text-base md:text-sm">
            <span className="text-muted-foreground font-medium">
              Alex → You
            </span>
            <span className="font-bold text-green-600 dark:text-green-400">
              $24.50
            </span>
          </div>
          <div className="flex items-center justify-between text-base md:text-sm opacity-60">
            <span className="text-muted-foreground font-medium">Sam → You</span>
            <span className="font-bold text-green-600 dark:text-green-400">
              $12.25
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Real-time Balances",
      description: "See who owes whom at a glance with instant updates.",
      icon: BarChart3,
      className: "md:col-span-1 md:row-span-1",
      gradient: "from-green-500 to-emerald-500",
      visual: (
        <div className=" p-4 md:p-5">
          <div className="bg-card rounded-xl p-3 md:p-4 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] md:text-xs font-medium text-muted-foreground">
                Your Balance
              </span>
              <span className="text-base md:text-lg font-bold text-green-600 dark:text-green-400">
                +$36.75
              </span>
            </div>
            <div className="h-1.5 md:h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full w-3/4 group-hover:w-full transition-all duration-700" />
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section
      id="features"
      className="py-20 md:py-28 lg:py-32 bg-background relative overflow-hidden"
    >
      {/* subtle glow behind grid */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[520px] h-[520px] bg-primary/5 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-[360px] h-[360px] bg-blue-500/5 blur-3xl rounded-full" />
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-[0.18em] mb-4">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Key Features
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Everything needed to <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
              stay even, effortlessly.
            </span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            TripSplit handles the complexities of group finance so you can focus
            on the fun parts of being together.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className={`group relative ${feature.className} flex flex-col bg-card rounded-2xl md:rounded-3xl border border-border shadow-sm hover:shadow-md transition-all duration-200`}
            >
              <div className="p-5 md:p-6 flex-shrink-0 text-left">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <feature.icon size={20} strokeWidth={2} />
                  </div>
                  {idx === 0 && (
                    <span className="hidden md:inline-flex items-center px-2 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-medium">
                      Most used
                    </span>
                  )}
                </div>

                <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-[15px]">
                  {feature.description}
                </p>
              </div>

              {/* Visualization */}
              <div className="flex-1 flex flex-col justify-end">
                {feature.visual}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
