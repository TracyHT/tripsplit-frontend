import React from "react";
import { ClipboardList, Receipt, HandCoins } from "lucide-react";

const steps = [
  {
    step: "STEP 1",
    number: "1",
    title: "Create a Trip",
    description:
      "Start by creating a trip, naming it, and adding all the people who will share expenses.",
    helper: null,
  },
  {
    step: "STEP 2",
    number: "2",
    title: "Add Expenses",
    description:
      "Log each bill with who paid, who participated, and how you want to split the cost.",
    helper: "Supports equal, exact amount, and percentage splits",
  },
  {
    step: "STEP 3",
    number: "3",
    title: "Settle Up Smartly",
    description:
      "TripSplit calculates the minimal set of payments so everyone can settle up in just a few transfers.",
    helper: "Fewer payments, less confusion",
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <section
      id="how-it-works"
      className="py-20 md:py-28 lg:py-32 bg-muted/30 border-b border-border/50"
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-[0.18em] mb-4">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Simple 3-step flow
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3">
            How TripSplit Works
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            Go from “Who owes what?” to “We’re all settled” in just a few steps.
          </p>
        </div>

        {/* Steps + top numbered markers */}
        <div className="max-w-5xl mx-auto">
          {/* Line + numbered circles */}
          <div className="relative mb-8 md:mb-10">
            {/* Center line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-primary/20" />
            <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
              {steps.map((s) => (
                <div
                  key={s.number}
                  className="relative flex items-center justify-center"
                >
                  <div className="w-8 h-8 rounded-full border border-primary/40 bg-background text-primary text-xs font-semibold flex items-center justify-center shadow-xs">
                    {s.number}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {steps.map((s, index) => {
              const Icon =
                index === 0 ? ClipboardList : index === 1 ? Receipt : HandCoins;

              return (
                <div
                  key={s.step}
                  className="h-full rounded-[16px] bg-background shadow-soft border border-border/60 hover:border-primary/30 hover:shadow-lg transition-all duration-300 text-left"
                >
                  <div className="p-6 md:p-7 flex flex-col h-full">
                    {/* Icon */}
                    <div className="mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>

                    {/* Text */}
                    <div className="space-y-1 mb-4 ">
                      <div className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        {s.step}
                      </div>
                      <h3 className="text-lg md:text-xl font-semibold text-foreground">
                        {s.title}
                      </h3>
                    </div>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed flex-1">
                      {s.description}
                    </p>

                    {/* Helper pill */}
                    {s.helper && (
                      <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 text-[11px] font-medium text-primary">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {s.helper}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-8 text-xs md:text-sm text-muted-foreground text-center">
            You can manage multiple trips at once — each with its own
            participants, currencies, and expense history.
          </p>
        </div>
      </div>
    </section>
  );
};
export default HowItWorks;
