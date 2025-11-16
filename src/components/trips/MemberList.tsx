import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical, Crown, Trash2 } from 'lucide-react';
import { useRemoveUserFromGroup } from '@/hooks/useApi';
import { toast } from '@/lib/toast';
import type { User, Group } from '@/types/api';
import { useAuth } from '@/contexts/AuthContext';
import AddMemberDialog from './AddMemberDialog';

interface MemberListProps {
  trip: Group;
  onMemberRemoved?: () => void;
}

export default function MemberList({ trip, onMemberRemoved }: MemberListProps) {
  const { user: currentUser } = useAuth();
  const removeUserFromGroup = useRemoveUserFromGroup();
  const [removingUserId, setRemovingUserId] = useState<string | null>(null);

  const members = Array.isArray(trip.members) ? (trip.members as User[]) : [];
  const creatorId = typeof trip.createdBy === 'string' ? trip.createdBy : trip.createdBy._id;
  const isCreator = currentUser?._id === creatorId;
  const currentMemberIds = members.map((m) => (typeof m === 'string' ? m : m._id));

  const handleRemoveMember = async (userId: string, userName: string) => {
    if (!isCreator) {
      toast.error('Only the trip creator can remove members');
      return;
    }

    if (userId === creatorId) {
      toast.error('Cannot remove the trip creator');
      return;
    }

    if (!confirm(`Are you sure you want to remove ${userName} from this trip?`)) {
      return;
    }

    setRemovingUserId(userId);
    try {
      await removeUserFromGroup.mutateAsync({
        groupId: trip._id,
        userId,
      });

      toast.success(`${userName} removed from trip`);
      onMemberRemoved?.();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to remove member';
      toast.error(message);
    } finally {
      setRemovingUserId(null);
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Members</CardTitle>
            <CardDescription>
              {members.length} {members.length === 1 ? 'member' : 'members'} in this trip
            </CardDescription>
          </div>
          {isCreator && (
            <AddMemberDialog
              groupId={trip._id}
              currentMemberIds={currentMemberIds}
              onSuccess={onMemberRemoved}
            />
          )}
        </div>
      </CardHeader>
      <CardContent>
        {members.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No members yet</p>
            {isCreator && (
              <p className="text-sm mt-2">Click "Add Member" to invite people to this trip</p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {members.map((member) => {
              const memberData = typeof member === 'string' ? null : member;
              if (!memberData) return null;

              const isThisCreator = memberData._id === creatorId;
              const isCurrentUser = memberData._id === currentUser?._id;
              const isRemoving = removingUserId === memberData._id;

              return (
                <div
                  key={memberData._id}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                >
                  <Avatar className="h-10 w-10">
                    {memberData.avatar && (
                      <AvatarImage src={memberData.avatar} alt={memberData.name} />
                    )}
                    <AvatarFallback>{getInitials(memberData.name)}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{memberData.name}</p>
                      {isThisCreator && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Crown className="h-3 w-3" />
                          Creator
                        </Badge>
                      )}
                      {isCurrentUser && !isThisCreator && (
                        <Badge variant="outline">You</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {memberData.email}
                    </p>
                  </div>

                  {isCreator && !isThisCreator && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={isRemoving}
                          className="h-8 w-8 p-0"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          destructive
                          onClick={() => handleRemoveMember(memberData._id, memberData.name)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove from trip
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
