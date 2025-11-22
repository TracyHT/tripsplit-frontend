import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Receipt, DollarSign, Calendar } from 'lucide-react';
import type { Expense, User } from '@/types/api';
import AddExpenseDialog from './AddExpenseDialog';

interface ExpenseListProps {
  groupId: string;
  expenses: Expense[];
  onExpenseAdded?: () => void;
}

export default function ExpenseList({ groupId, expenses, onExpenseAdded }: ExpenseListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Expenses</CardTitle>
            <CardDescription>
              {expenses.length} {expenses.length === 1 ? 'expense' : 'expenses'} • Total: {formatCurrency(totalExpenses)}
            </CardDescription>
          </div>
          <AddExpenseDialog groupId={groupId} onSuccess={onExpenseAdded} />
        </div>
      </CardHeader>
      <CardContent>
        {expenses.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="font-medium">No expenses yet</p>
            <p className="text-sm mt-2">Click "Add Expense" to start tracking expenses for this trip</p>
          </div>
        ) : (
          <div className="space-y-3">
            {expenses.map((expense) => {
              const paidBy = typeof expense.paidBy === 'string' ? null : (expense.paidBy as User);
              const paidByName = paidBy?.name || 'Unknown';

              return (
                <div
                  key={expense._id}
                  className="flex items-start gap-4 p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Receipt className="h-5 w-5 text-primary" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-medium">{expense.description}</h4>
                      <div className="flex items-center gap-1 text-lg font-semibold flex-shrink-0">
                        <DollarSign className="h-4 w-4" />
                        {expense.amount.toFixed(2)}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                      <span>Paid by {paidByName}</span>

                      {expense.category && (
                        <Badge variant="outline" className="text-xs">
                          {expense.category}
                        </Badge>
                      )}

                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(expense.date)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
