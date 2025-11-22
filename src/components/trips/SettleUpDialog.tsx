import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useBalances, useSettlementTransactions } from '@/hooks/useApi';
import { Loader2, ArrowRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SettleUpDialogProps {
  groupId: string;
  groupName: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export default function SettleUpDialog({
  groupId,
  groupName,
  children,
  disabled = false,
}: SettleUpDialogProps) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  const { data: balances, isLoading: loadingBalances } = useBalances(groupId);
  const { data: transactions, isLoading: loadingTransactions } = useSettlementTransactions(groupId);

  const isLoading = loadingBalances || loadingTransactions;

  const formatCurrency = (amount: number) => {
    return `$${Math.abs(amount).toFixed(2)}`;
  };

  // Find current user's balance
  const currentUserBalance = balances?.find(b => b.user_id === user?._id);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" disabled={disabled}>
            Settle Up
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Settle Up - {groupName}</DialogTitle>
          <DialogDescription>
            View balances and suggested settlements for this trip.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="py-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
            <p className="text-muted-foreground">Calculating balances...</p>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Current User Balance Summary */}
            {currentUserBalance && (
              <div className={`p-4 rounded-lg border-2 ${
                currentUserBalance.balance > 0.01
                  ? 'border-green-500 bg-green-50'
                  : currentUserBalance.balance < -0.01
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300 bg-gray-50'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  {currentUserBalance.balance > 0.01 ? (
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  ) : currentUserBalance.balance < -0.01 ? (
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  ) : (
                    <Minus className="h-5 w-5 text-gray-600" />
                  )}
                  <span className="font-semibold">Your Balance</span>
                </div>
                <p className={`text-2xl font-bold ${
                  currentUserBalance.balance > 0.01
                    ? 'text-green-600'
                    : currentUserBalance.balance < -0.01
                      ? 'text-red-600'
                      : 'text-gray-600'
                }`}>
                  {currentUserBalance.balance > 0.01
                    ? `+${formatCurrency(currentUserBalance.balance)} (owed to you)`
                    : currentUserBalance.balance < -0.01
                      ? `-${formatCurrency(currentUserBalance.balance)} (you owe)`
                      : 'All settled up!'}
                </p>
              </div>
            )}

            {/* All Balances */}
            <div>
              <h3 className="font-semibold mb-3">Member Balances</h3>
              {balances && balances.length > 0 ? (
                <div className="space-y-2">
                  {balances.map((balance) => (
                    <div
                      key={balance.user_id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <span className="font-medium">
                        {balance.name}
                        {balance.user_id === user?._id && ' (You)'}
                      </span>
                      <span className={`font-semibold ${
                        balance.balance > 0.01
                          ? 'text-green-600'
                          : balance.balance < -0.01
                            ? 'text-red-600'
                            : 'text-gray-500'
                      }`}>
                        {balance.balance > 0.01
                          ? `+${formatCurrency(balance.balance)}`
                          : balance.balance < -0.01
                            ? `-${formatCurrency(balance.balance)}`
                            : '$0.00'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No balances to display. Add some expenses first!
                </p>
              )}
            </div>

            {/* Settlement Transactions */}
            <div>
              <h3 className="font-semibold mb-3">Suggested Settlements</h3>
              {transactions && transactions.length > 0 ? (
                <div className="space-y-2">
                  {transactions.map((transaction, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        transaction.from.id === user?._id
                          ? 'bg-red-50 border-red-200'
                          : transaction.to.id === user?._id
                            ? 'bg-green-50 border-green-200'
                            : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {transaction.from.name}
                          {transaction.from.id === user?._id && ' (You)'}
                        </span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {transaction.to.name}
                          {transaction.to.id === user?._id && ' (You)'}
                        </span>
                      </div>
                      <span className="font-bold text-primary">
                        {formatCurrency(transaction.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  {balances && balances.length > 0
                    ? 'Everyone is settled up!'
                    : 'No settlements needed.'}
                </p>
              )}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
