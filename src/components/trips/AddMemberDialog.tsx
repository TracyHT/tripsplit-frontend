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
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const { data: users, isLoading: loadingUsers } = useUsers();
  const addUserToGroup = useAddUserToGroup();

  // Filter out users who are already members
  const availableUsers = (users || []).filter(
    (user) => !currentMemberIds.includes(user._id)
  );

  // Filter users based on search query
  const filteredUsers = availableUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddMember = async () => {
    if (!selectedUserId) {
      toast.error('Please select a user to add');
      return;
    }

    try {
      await addUserToGroup.mutateAsync({
        groupId,
        userId: selectedUserId,
      });

      toast.success('Member added successfully!');
      setOpen(false);
      setSearchQuery('');
      setSelectedUserId(null);
      onSuccess?.();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to add member';
      toast.error(message);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setSearchQuery('');
      setSelectedUserId(null);
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
            Add Member
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
          <DialogDescription>
            Add a new member to this trip. Search for users by name or email.
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

          {/* User List */}
          <div className="space-y-2">
            <Label>Available Users</Label>
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
                    <button
                      key={user._id}
                      type="button"
                      className={`w-full p-3 flex items-center gap-3 hover:bg-accent transition-colors ${
                        selectedUserId === user._id ? 'bg-accent' : ''
                      }`}
                      onClick={() => setSelectedUserId(user._id)}
                      disabled={addUserToGroup.isPending}
                    >
                      <Avatar className="h-10 w-10">
                        {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 text-left">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                      {selectedUserId === user._id && (
                        <div className="h-4 w-4 rounded-full bg-primary flex-shrink-0" />
                      )}
                    </button>
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
            onClick={handleAddMember}
            disabled={!selectedUserId || addUserToGroup.isPending}
          >
            {addUserToGroup.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              'Add Member'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
