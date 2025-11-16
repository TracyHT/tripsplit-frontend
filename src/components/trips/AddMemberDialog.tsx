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
import { Checkbox } from '@/components/ui/checkbox';
import { useAddUserToGroup, useUsers } from '@/hooks/useApi';
import { toast } from '@/lib/toast';
import { Loader2, UserPlus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AddMemberDialogProps {
  groupId: string;
  currentMemberIds: string[];
  children?: React.ReactNode;
  onSuccess?: () => void;
}

export default function AddMemberDialog({
  groupId,
  currentMemberIds,
  children,
  onSuccess
}: AddMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const { data: users, isLoading: loadingUsers } = useUsers();
  const addUserToGroup = useAddUserToGroup();

  const availableUsers = (users || []).filter(
    (user) => !currentMemberIds.includes(user._id)
  );

  const filteredUsers = availableUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddMembers = async () => {
    if (selectedUserIds.length === 0) {
      toast.error('Please select at least one user to add');
      return;
    }

    try {
      await addUserToGroup.mutateAsync({
        groupId,
        userId: selectedUserIds,
      });

      const count = selectedUserIds.length;
      toast.success(`${count} ${count === 1 ? 'member' : 'members'} added successfully!`);
      setOpen(false);
      setSearchQuery('');
      setSelectedUserIds([]);
      onSuccess?.();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to add members';
      toast.error(message);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setSearchQuery('');
      setSelectedUserIds([]);
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUserIds(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUserIds.length === filteredUsers.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(filteredUsers.map(user => user._id));
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <Button size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Members
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Members</DialogTitle>
          <DialogDescription>
            Add members to this trip. You can select multiple users at once.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search Users</Label>
            <Input
              id="search"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={addUserToGroup.isPending}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Available Users ({selectedUserIds.length} selected)</Label>
              {filteredUsers.length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={toggleSelectAll}
                  disabled={addUserToGroup.isPending}
                >
                  {selectedUserIds.length === filteredUsers.length ? 'Deselect All' : 'Select All'}
                </Button>
              )}
            </div>
            <div className="border rounded-md max-h-[300px] overflow-y-auto">
              {loadingUsers ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                  Loading users...
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  {availableUsers.length === 0
                    ? 'All users are already members of this trip'
                    : 'No users found'}
                </div>
              ) : (
                <div className="divide-y">
                  {filteredUsers.map((user) => (
                    <div
                      key={user._id}
                      className="p-3 flex items-center gap-3 hover:bg-accent transition-colors cursor-pointer"
                      onClick={() => toggleUserSelection(user._id)}
                    >
                      <Checkbox
                        checked={selectedUserIds.includes(user._id)}
                        onCheckedChange={() => toggleUserSelection(user._id)}
                        disabled={addUserToGroup.isPending}
                      />
                      <Avatar className="h-10 w-10">
                        {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 text-left">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={addUserToGroup.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddMembers}
            disabled={selectedUserIds.length === 0 || addUserToGroup.isPending}
          >
            {addUserToGroup.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              `Add ${selectedUserIds.length > 0 ? `(${selectedUserIds.length})` : 'Members'}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
