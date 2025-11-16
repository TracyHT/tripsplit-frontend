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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateExpense, useGroup } from '@/hooks/useApi';
import { groupsApi } from '@/lib/api';
import { toast } from '@/lib/toast';
import { Loader2, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AddExpenseDialogProps {
  groupId: string;
  children?: React.ReactNode;
  onSuccess?: () => void;
}

export default function AddExpenseDialog({ groupId, children, onSuccess }: AddExpenseDialogProps) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');

  const { user } = useAuth();
  const { data: group } = useGroup(groupId);
  const createExpense = useCreateExpense();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) {
      toast.error('Please enter a description');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to add expenses');
      return;
    }

    if (!group) {
      toast.error('Group not found');
      return;
    }

    // Get all member IDs for split
    const memberIds = (group.members || [])
      .map((m) => (typeof m === 'string' ? m : m._id))
      .filter(Boolean);

    if (memberIds.length === 0) {
      toast.error('No members in this group');
      return;
    }

    try {
      // Create the expense
      const expenseResponse = await createExpense.mutateAsync({
        description: description.trim(),
        amount: amountNum,
        paid_by: [user._id], // Current user paid
        paid_for: memberIds, // Split among all members
      });

      // Add expense to the group
      if (expenseResponse.data._id) {
        await groupsApi.addExpenseToGroup(groupId, expenseResponse.data._id);
      }

      toast.success('Expense added successfully!');
      setOpen(false);
      setDescription('');
      setAmount('');
      setCategory('');
      onSuccess?.();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to add expense';
      toast.error(message);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setDescription('');
      setAmount('');
      setCategory('');
    }
  };

  const categories = [
    'Food & Dining',
    'Transportation',
    'Accommodation',
    'Entertainment',
    'Shopping',
    'Activities',
    'Other',
  ];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
          <DialogDescription>
            Add a new expense to this trip. It will be split equally among all members.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Input
                id="description"
                placeholder="e.g., Dinner at restaurant"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={createExpense.isPending}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (USD) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={createExpense.isPending}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category (Optional)</Label>
              <select
                id="category"
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={createExpense.isPending}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-md bg-muted p-3 text-sm">
              <p className="font-medium mb-1">Split Info:</p>
              <p className="text-muted-foreground">
                This expense will be split equally among all {group?.members?.length || 0} members of the trip.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={createExpense.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createExpense.isPending}>
              {createExpense.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Expense'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
