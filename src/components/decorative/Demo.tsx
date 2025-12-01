import React, { useState, useEffect } from "react";
import { Calculator, ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const Demo: React.FC = () => {
  // Manual Entry State
  const [description, setDescription] = useState("Team Dinner");
  const [amount, setAmount] = useState<string>("120");
  const [paidBy, setPaidBy] = useState("Me");
  const [users] = useState(["Me", "Alex", "Sam"]);

  // Calculation Result State
  const [result, setResult] = useState<{ ower: string; amount: number }[]>([]);

  useEffect(() => {
    calculateSplit();
  }, [amount, paidBy]);

  const calculateSplit = () => {
    const total = parseFloat(amount) || 0;
    if (total <= 0) {
      setResult([]);
      return;
    }

    const splitAmount = total / users.length;

    // Simple logic: If 'Me' pays, others owe 'Me'. If 'Alex' pays, 'Me' owes 'Alex'.
    // For this demo, we just show who owes the payer.
    const newResult = users
      .filter((u) => u !== paidBy)
      .map((u) => ({
        ower: u,
        amount: splitAmount,
      }));

    setResult(newResult);
  };

  return (
    <section id="demo">
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl lg:rounded-[3rem] bg-gray-900">
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-full md:w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent"></div>

        <div className="container mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-12 lg:py-20 relative z-10 text-white">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            <div className="text-center lg:text-left mb-8 lg:mb-0">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 text-primary border border-primary/30 text-xs font-semibold uppercase tracking-wider mb-4 md:mb-6">
                <Calculator size={14} /> Interactive Demo
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight">
                Total control over <br />
                <span className="text-primary">your expenses.</span>
              </h2>
              <p className="text-gray-300 text-sm md:text-base lg:text-lg mb-6 md:mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                You enter the details, we crunch the numbers instantly. Try
                adding an expense to see how easy it is to keep everyone even.
              </p>

              <div className="flex flex-col gap-4 md:gap-6 bg-gray-800/50 p-4 md:p-6 rounded-xl border border-gray-700">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Amount ($)
                      </label>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Paid By
                      </label>
                      <select
                        value={paidBy}
                        onChange={(e) => setPaidBy(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none"
                      >
                        {users.map((u) => (
                          <option key={u} value={u}>
                            {u}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <Button onClick={calculateSplit} className="w-full gap-2">
                  <Plus size={18} /> Update Split
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 md:p-6 lg:p-8 shadow-2xl min-h-[350px] md:min-h-[400px] flex flex-col text-gray-900 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 md:h-2 bg-primary"></div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-6 md:mb-8 pb-4 md:pb-6 border-b border-gray-100">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                    {description || "Expense"}
                  </h3>
                  <p className="text-gray-500 text-sm md:text-base text-left">
                    Paid by{" "}
                    <span className="font-semibold text-primary">{paidBy}</span>
                  </p>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900">
                  ${parseFloat(amount || "0").toFixed(2)}
                </div>
              </div>

              <div className="flex-1">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 md:mb-4">
                  How it's split
                </h4>

                <div className="space-y-3 md:space-y-4">
                  {/* The Payer */}
                  <div className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-100 opacity-60">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-xs md:text-sm text-gray-600">
                        {paidBy.charAt(0)}
                      </div>
                      <span className="font-medium text-base md:text-lg">
                        {paidBy}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900 text-base md:text-lg">
                        ${(parseFloat(amount || "0") / users.length).toFixed(2)}
                      </div>
                      <div className="text-xs text-green-600 font-medium">
                        Already paid
                      </div>
                    </div>
                  </div>

                  {/* The Owers */}
                  {result.map((share, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 md:p-4 bg-white rounded-lg border border-primary/20 shadow-sm"
                    >
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs md:text-sm text-primary">
                          {share.ower.charAt(0)}
                        </div>
                        <span className="font-medium text-base md:text-lg">
                          {share.ower}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-red-500 text-base md:text-lg">
                          owes ${share.amount.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-400">to {paidBy}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-100 text-center">
                <p className="text-gray-500 text-xs md:text-sm flex items-center justify-center gap-2">
                  <ArrowRight size={14} className="text-primary" />
                  Split equally among {users.length} people
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demo;
