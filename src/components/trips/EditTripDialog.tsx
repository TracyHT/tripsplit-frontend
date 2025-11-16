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
import { Textarea } from '@/components/ui/textarea';
import { useUpdateGroup } from '@/hooks/useApi';
import { toast } from '@/lib/toast';
import { Loader2 } from 'lucide-react';
import type { Group } from '@/types/api';

interface EditTripDialogProps {
  trip: Group;
  children?: React.ReactNode;
  onSuccess?: () => void;
}

export default function EditTripDialog({ trip, children, onSuccess }: EditTripDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(trip.name);
  const [description, setDescription] = useState(trip.description || '');
  const updateGroup = useUpdateGroup();

  useEffect(() => {
    if (open) {
      setName(trip.name);
      setDescription(trip.description || '');
    }
  }, [open, trip]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter a trip name');
      return;
    }

    try {
      await updateGroup.mutateAsync({
        groupId: trip._id,
        data: {
          name: name.trim(),
          description: description.trim() || undefined,
        },
      });

      toast.success('Trip updated successfully!');
      setOpen(false);
      onSuccess?.();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update trip';
      toast.error(message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || <Button variant="outline">Edit Trip</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Trip</DialogTitle>
          <DialogDescription>
            Update the details of your group trip.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Trip Name *</Label>
              <Input
                id="edit-name"
                placeholder="e.g., Europe Adventure 2024"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={updateGroup.isPending}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description (Optional)</Label>
              <Textarea
                id="edit-description"
                placeholder="Add details about your trip..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={updateGroup.isPending}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={updateGroup.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateGroup.isPending}>
              {updateGroup.isPending ? (
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
