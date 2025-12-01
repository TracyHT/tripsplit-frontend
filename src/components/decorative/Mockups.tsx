import React from "react";

const Mockups: React.FC = () => {
  return (
    <section className="py-20 md:py-28 lg:py-32 bg-primary/5 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 mb-16 md:mb-20">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-foreground mb-4 md:mb-6">
            Seamless on every device
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-muted-foreground">
            Whether you're on your laptop at home or on your phone at dinner,
            TripSplit is responsive and ready. No app install needed.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative">
        {/* Background decoration */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-6xl h-[300px] md:h-[500px] bg-primary/10 -skew-y-3 z-0 rounded-3xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end justify-center gap-8 md:gap-0 md:-space-x-12 lg:-space-x-24 pb-8 md:pb-12">
          {/* Desktop Mockup */}
          <div className="relative z-10 w-full max-w-3xl md:max-w-4xl bg-gray-900 dark:bg-gray-950 rounded-t-lg md:rounded-t-xl shadow-2xl border-t-[8px] md:border-t-[12px] border-x-[8px] md:border-x-[12px] border-gray-900 dark:border-gray-950 overflow-hidden">
            <div className="bg-gray-800 dark:bg-gray-900 w-full h-8 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="bg-white dark:bg-card aspect-[16/10] relative overflow-hidden">
              {/* Desktop UI Abstract */}
              <div className="flex h-full">
                <div className="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-100 dark:border-border p-6 hidden md:block">
                  <div className="h-8 w-32 bg-gray-200 dark:bg-gray-800 rounded mb-8"></div>
                  <div className="space-y-4">
                    <div className="h-4 w-full bg-primary/20 rounded"></div>
                    <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded"></div>
                    <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-800 rounded"></div>
                  </div>
                </div>
                <div className="flex-1 p-8">
                  <div className="flex justify-between mb-8">
                    <div className="h-10 w-48 bg-gray-200 dark:bg-gray-800 rounded"></div>
                    <div className="h-10 w-32 bg-primary rounded"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="h-32 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-border p-4">
                      <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
                      <div className="h-8 w-24 bg-gray-800 dark:bg-gray-700 rounded"></div>
                    </div>
                    <div className="h-32 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-border p-4">
                      <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
                      <div className="h-8 w-24 bg-green-500 rounded"></div>
                    </div>
                    <div className="h-32 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-border p-4">
                      <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
                      <div className="h-8 w-24 bg-red-400 rounded"></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-16 w-full border border-gray-100 dark:border-border rounded-lg flex items-center px-4 gap-4"
                      >
                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800"></div>
                        <div className="flex-1">
                          <div className="h-3 w-32 bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
                          <div className="h-2 w-20 bg-gray-100 dark:bg-gray-900 rounded"></div>
                        </div>
                        <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Mockup (Overlapping) */}
          <div className="relative z-20 w-[180px] sm:w-[200px] md:w-[220px] lg:w-[240px] bg-gray-900 dark:bg-gray-950 rounded-[2rem] md:rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] border-[6px] md:border-[8px] border-gray-900 dark:border-gray-950 overflow-hidden transform md:translate-y-12">
            <div className="absolute top-0 left-0 right-0 h-6 bg-gray-900 dark:bg-gray-950 z-30 flex justify-center">
              <div className="w-20 h-4 bg-black rounded-b-xl"></div>
            </div>
            <div className="bg-white dark:bg-card h-full pt-8 pb-4 px-4 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                <div className="font-bold text-sm dark:text-foreground">
                  Dashboard
                </div>
                <div className="w-8 h-8"></div>
              </div>
              <div className="bg-primary rounded-xl p-4 text-white mb-6 shadow-lg shadow-primary/30">
                <div className="text-xs opacity-80 mb-1">Total Owed</div>
                <div className="text-2xl font-bold">$450.00</div>
              </div>
              <div className="flex-1 space-y-3 overflow-hidden">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <div className="h-2 w-16 bg-gray-200 dark:bg-gray-800 rounded mb-1"></div>
                      <div className="h-2 w-10 bg-gray-100 dark:bg-gray-900 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mockups;
