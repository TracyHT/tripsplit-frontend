import { useState, useEffect } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { useCreateExpense, useGroup } from '@/hooks/useApi';
import { groupsApi } from '@/lib/api';
import { toast } from '@/lib/toast';
import { Loader2, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type { User } from '@/types/api';

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
  const [paidById, setPaidById] = useState<string>('');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);

  const { user } = useAuth();
  const { data: group } = useGroup(groupId);
  const createExpense = useCreateExpense();

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
    // Add creator if not already in the list
    if (creator && !allMembers.some(m => m._id === creator._id)) {
      allMembers.unshift(creator); // Add creator at the beginning
    }
    return allMembers;
  })();

  // Initialize paidById and selectedParticipants when dialog opens or members change
  useEffect(() => {
    if (open && members.length > 0) {
      // Default payer to current user if they're a member, otherwise first member (creator)
      const currentUserIsMember = members.some(m => m._id === user?._id);
      if (!paidById) {
        setPaidById(currentUserIsMember ? user!._id : members[0]._id);
      }
      // Default all members as participants
      if (selectedParticipants.length === 0) {
        setSelectedParticipants(members.map(m => m._id));
      }
    }
  }, [open, members, user, paidById, selectedParticipants.length]);

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

    if (!paidById) {
      toast.error('Please select who paid for this expense');
      return;
    }

    if (selectedParticipants.length === 0) {
      toast.error('Please select at least one participant');
      return;
    }

    try {
      // Create the expense
      const expenseResponse = await createExpense.mutateAsync({
        description: description.trim(),
        amount: amountNum,
        paid_by: [paidById],
        paid_for: selectedParticipants,
      });

      // Add expense to the group
      const expenseId = expenseResponse?.data?._id || expenseResponse?._id;

      if (!expenseId) {
        toast.error('Failed to get expense ID from response');
        return;
      }

      await groupsApi.addExpenseToGroup(groupId, expenseId);

      toast.success('Expense added successfully!');
      setOpen(false);
      resetForm();
      onSuccess?.();
    } catch (error: any) {
      const status = error.response?.status;
      const message = error.response?.data?.message || 'Failed to add expense';

      if (status === 401) {
        toast.error('Session expired. Please log in again.');
      } else {
        toast.error(message);
      }
    }
  };

  const resetForm = () => {
    setDescription('');
    setAmount('');
    setCategory('');
    setPaidById('');
    setSelectedParticipants([]);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      resetForm();
    }
  };

  const toggleParticipant = (memberId: string) => {
    setSelectedParticipants(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const selectAllParticipants = () => {
    setSelectedParticipants(members.map(m => m._id));
  };

  const deselectAllParticipants = () => {
    setSelectedParticipants([]);
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

  // Calculate split amount per person
  const splitAmount = selectedParticipants.length > 0 && amount
    ? (parseFloat(amount) / selectedParticipants.length).toFixed(2)
    : '0.00';

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
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
          <DialogDescription>
            Add a new expense to this trip and specify who paid and who's included.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Description */}
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

            {/* Amount */}
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

            {/* Category */}
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

            {/* Paid By */}
            <div className="space-y-2">
              <Label htmlFor="paidBy">Paid by *</Label>
              <select
                id="paidBy"
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={paidById}
                onChange={(e) => setPaidById(e.target.value)}
                disabled={createExpense.isPending}
                required
              >
                <option value="">Select who paid</option>
                {members.map((member) => {
                  const isCurrentUser = member._id === user?._id;
                  const isCreator = member._id === creator?._id;
                  const label = isCurrentUser && isCreator
                    ? '(You, Creator)'
                    : isCurrentUser
                      ? '(You)'
                      : isCreator
                        ? '(Creator)'
                        : '';
                  return (
                    <option key={member._id} value={member._id}>
                      {member.name} {label}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Participants (Split between) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Split between *</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={selectAllParticipants}
                    disabled={createExpense.isPending}
                  >
                    Select All
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={deselectAllParticipants}
                    disabled={createExpense.isPending}
                  >
                    Deselect All
                  </Button>
                </div>
              </div>
              <div className="border rounded-md p-3 space-y-2 max-h-40 overflow-y-auto">
                {members.map((member) => {
                  const isCurrentUser = member._id === user?._id;
                  const isCreator = member._id === creator?._id;
                  const label = isCurrentUser && isCreator
                    ? '(You, Creator)'
                    : isCurrentUser
                      ? '(You)'
                      : isCreator
                        ? '(Creator)'
                        : '';
                  return (
                    <div key={member._id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`participant-${member._id}`}
                        checked={selectedParticipants.includes(member._id)}
                        onCheckedChange={() => toggleParticipant(member._id)}
                        disabled={createExpense.isPending}
                      />
                      <label
                        htmlFor={`participant-${member._id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {member.name} {label}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Split Info */}
            <div className="rounded-md bg-muted p-3 text-sm">
              <p className="font-medium mb-1">Split Info:</p>
              <p className="text-muted-foreground">
                {selectedParticipants.length > 0 ? (
                  <>
                    Split equally among {selectedParticipants.length} {selectedParticipants.length === 1 ? 'person' : 'people'}
                    {amount && parseFloat(amount) > 0 && (
                      <> — ${splitAmount} each</>
                    )}
                  </>
                ) : (
                  'Select participants to split the expense'
                )}
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
