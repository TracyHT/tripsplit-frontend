import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useUpdateExpense } from '@/hooks/useApi';
import { toast } from '@/lib/toast';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type { User, Expense } from '@/types/api';

interface EditExpenseDialogProps {
  expense: Expense;
  members: User[];
  creator: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function EditExpenseDialog({
  expense,
  members,
  creator,
  open,
  onOpenChange,
  onSuccess,
}: EditExpenseDialogProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidById, setPaidById] = useState<string>('');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);

  const { user } = useAuth();
  const updateExpense = useUpdateExpense();

  // Initialize form with expense data when dialog opens
  useEffect(() => {
    if (open && expense) {
      setDescription(expense.description || '');
      setAmount(expense.amount?.toString() || '');

      // Set paid by
      const paidByUser = expense.paid_by?.[0];
      const paidByUserId = typeof paidByUser === 'string' ? paidByUser : paidByUser?._id;
      setPaidById(paidByUserId || '');

      // Set participants
      const participantIds = (expense.paid_for || []).map(p =>
        typeof p === 'string' ? p : p._id
      );
      setSelectedParticipants(participantIds);
    }
  }, [open, expense]);

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

    if (!paidById) {
      toast.error('Please select who paid for this expense');
      return;
    }

    if (selectedParticipants.length === 0) {
      toast.error('Please select at least one participant');
      return;
    }

    try {
      await updateExpense.mutateAsync({
        expenseId: expense._id,
        data: {
          description: description.trim(),
          amount: amountNum,
          paid_by: [paidById],
          paid_for: selectedParticipants,
        },
      });

      toast.success('Expense updated successfully!');
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      const status = error.response?.status;
      const message = error.response?.data?.message || 'Failed to update expense';

      if (status === 401) {
        toast.error('Session expired. Please log in again.');
      } else {
        toast.error(message);
      }
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

  // Calculate split amount per person
  const splitAmount = selectedParticipants.length > 0 && amount
    ? (parseFloat(amount) / selectedParticipants.length).toFixed(2)
    : '0.00';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Expense</DialogTitle>
          <DialogDescription>
            Update the expense details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description *</Label>
              <Input
                id="edit-description"
                placeholder="e.g., Dinner at restaurant"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={updateExpense.isPending}
                required
              />
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="edit-amount">Amount (USD) *</Label>
              <Input
                id="edit-amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={updateExpense.isPending}
                required
              />
            </div>

            {/* Paid By */}
            <div className="space-y-2">
              <Label htmlFor="edit-paidBy">Paid by *</Label>
              <select
                id="edit-paidBy"
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={paidById}
                onChange={(e) => setPaidById(e.target.value)}
                disabled={updateExpense.isPending}
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
                <Label className={selectedParticipants.length === 0 ? "text-destructive" : ""}>
                  Split between * {selectedParticipants.length > 0 && `(${selectedParticipants.length})`}
                </Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={selectAllParticipants}
                    disabled={updateExpense.isPending || selectedParticipants.length === members.length}
                  >
                    Select All
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={deselectAllParticipants}
                    disabled={updateExpense.isPending || selectedParticipants.length === 0}
                  >
                    Deselect All
                  </Button>
                </div>
              </div>
              <div className={`border rounded-md p-3 space-y-2 max-h-40 overflow-y-auto ${selectedParticipants.length === 0 ? "border-destructive" : ""}`}>
                {members.map((member) => {
                  const isCurrentUser = member._id === user?._id;
                  const isCreatorMember = member._id === creator?._id;
                  const label = isCurrentUser && isCreatorMember
                    ? '(You, Creator)'
                    : isCurrentUser
                      ? '(You)'
                      : isCreatorMember
                        ? '(Creator)'
                        : '';
                  return (
                    <div key={member._id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`edit-participant-${member._id}`}
                        checked={selectedParticipants.includes(member._id)}
                        onCheckedChange={() => toggleParticipant(member._id)}
                        disabled={updateExpense.isPending}
                      />
                      <label
                        htmlFor={`edit-participant-${member._id}`}
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
              onClick={() => onOpenChange(false)}
              disabled={updateExpense.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateExpense.isPending}>
              {updateExpense.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
