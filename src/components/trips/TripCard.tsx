import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Calendar } from "lucide-react";
import type { Group, User } from "@/types/api";
import { useNavigate } from "react-router-dom";

interface TripCardProps {
  trip: Group;
}

export default function TripCard({ trip }: TripCardProps) {
  const navigate = useNavigate();

  const members = Array.isArray(trip.user_ids) ? trip.user_ids : [];
  const memberCount = members.length;

  // Get first 3 members for avatar display
  const displayMembers = members.slice(0, 3) as User[];

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => navigate(`/trips/${trip._id}`)}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1 text-left">
            <CardTitle className="text-xl mb-1">{trip.name}</CardTitle>
            <CardDescription className="line-clamp-2">
              {trip.description || "No description"}
            </CardDescription>
          </div>
          <Badge variant="secondary">
            {memberCount} {memberCount === 1 ? "member" : "members"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {/* Members Preview */}
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div className="flex -space-x-2">
              {displayMembers.map((member) => {
                const memberData = typeof member === "string" ? null : member;
                const initials = memberData?.name
                  ? memberData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
                  : "?";

                return (
                  <Avatar
                    key={typeof member === "string" ? member : member._id}
                    className="h-8 w-8 border-2 border-background"
                  >
                    {memberData?.avatar && (
                      <AvatarImage
                        src={memberData.avatar}
                        alt={memberData.name}
                      />
                    )}
                    <AvatarFallback className="text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                );
              })}
              {memberCount > 3 && (
                <div className="h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs">
                  +{memberCount - 3}
                </div>
              )}
            </div>
          </div>

          {/* Created Date */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Created {formatDate(trip.createdAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
