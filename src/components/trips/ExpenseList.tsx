import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Receipt, DollarSign, Calendar, MoreVertical, Trash2, Loader2, Edit2 } from 'lucide-react';
import type { Expense, User, Group } from '@/types/api';
import AddExpenseDialog from './AddExpenseDialog';
import EditExpenseDialog from './EditExpenseDialog';
import { useDeleteExpense } from '@/hooks/useApi';
import { groupsApi } from '@/lib/api';
import { toast } from '@/lib/toast';

interface ExpenseListProps {
  groupId: string;
  expenses: Expense[];
  group: Group;
  onExpenseAdded?: () => void;
  onExpenseDeleted?: () => void;
  onExpenseUpdated?: () => void;
}

export default function ExpenseList({
  groupId,
  expenses,
  group,
  onExpenseAdded,
  onExpenseDeleted,
  onExpenseUpdated,
}: ExpenseListProps) {
  const [deletingExpenseId, setDeletingExpenseId] = useState<string | null>(null);
  const [expenseToDelete, setExpenseToDelete] = useState<{ id: string; description: string } | null>(null);
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);
  const deleteExpense = useDeleteExpense();

  // Get members from user_ids as User objects
  const userIdsMembers: User[] = (group?.user_ids || []).filter(
    (m): m is User => typeof m === 'object' && m !== null && '_id' in m
  );

  // Get creator (admin) as User object
  const creator: User | null = group?.admin_id && typeof group.admin_id === 'object' && '_id' in group.admin_id
    ? group.admin_id as User
    : null;

  // Combine creator and members, ensuring no duplicates
  const members: User[] = (() => {
    const allMembers: User[] = [...userIdsMembers];
    if (creator && !allMembers.some(m => m._id === creator._id)) {
      allMembers.unshift(creator);
    }
    return allMembers;
  })();

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

  const handleDeleteClick = (expenseId: string, expenseDescription: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpenseToDelete({ id: expenseId, description: expenseDescription });
  };

  const handleEditClick = (expense: Expense, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpenseToEdit(expense);
  };

  const handleExpenseClick = (expense: Expense) => {
    setExpenseToEdit(expense);
  };

  const handleConfirmDelete = async () => {
    if (!expenseToDelete) return;

    setDeletingExpenseId(expenseToDelete.id);
    setExpenseToDelete(null);

    try {
      // Remove expense from group first
      await groupsApi.removeExpenseFromGroup(groupId, expenseToDelete.id);
      // Then delete the expense
      await deleteExpense.mutateAsync(expenseToDelete.id);
      toast.success('Expense deleted successfully');
      onExpenseDeleted?.();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete expense';
      toast.error(message);
    } finally {
      setDeletingExpenseId(null);
    }
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <>
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
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {expenses.map((expense) => {
                // Get the first payer from paid_by array
                const firstPayer = expense.paid_by?.[0];
                const paidByUser = typeof firstPayer === 'object' && firstPayer !== null ? firstPayer as User : null;
                const paidByName = paidByUser?.name || 'Unknown';
                const isDeleting = deletingExpenseId === expense._id;

                return (
                  <div
                    key={expense._id}
                    onClick={() => !isDeleting && handleExpenseClick(expense)}
                    className={`flex items-start gap-4 p-4 rounded-lg border hover:bg-primary/5 hover:border-primary/20 transition-colors cursor-pointer ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Receipt className="h-5 w-5 text-primary" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-medium">{expense.description}</h4>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-lg font-semibold flex-shrink-0">
                            <DollarSign className="h-4 w-4" />
                            {expense.amount.toFixed(2)}
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                disabled={isDeleting}
                                onClick={(e) => e.stopPropagation()}
                              >
                                {isDeleting ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <MoreVertical className="h-4 w-4" />
                                )}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={(e) => handleEditClick(expense, e)}
                              >
                                <Edit2 className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={(e) => handleDeleteClick(expense._id, expense.description, e)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
                          {formatDate(expense.createdAt)}
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

      <ConfirmDialog
        open={!!expenseToDelete}
        onOpenChange={(open) => !open && setExpenseToDelete(null)}
        title="Delete Expense"
        description={`Are you sure you want to delete "${expenseToDelete?.description}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={handleConfirmDelete}
      />

      {expenseToEdit && (
        <EditExpenseDialog
          expense={expenseToEdit}
          members={members}
          creator={creator}
          open={!!expenseToEdit}
          onOpenChange={(open) => !open && setExpenseToEdit(null)}
          onSuccess={() => {
            setExpenseToEdit(null);
            onExpenseUpdated?.();
          }}
        />
      )}
    </>
  );
}
