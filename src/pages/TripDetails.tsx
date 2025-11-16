import { useParams, useNavigate } from 'react-router-dom';
import { useGroup, useDeleteGroup } from '@/hooks/useApi';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MemberList from '@/components/trips/MemberList';
import ExpenseList from '@/components/trips/ExpenseList';
import EditTripDialog from '@/components/trips/EditTripDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, MoreVertical, Edit2, Trash2, Users, Receipt, DollarSign } from 'lucide-react';
import { toast } from '@/lib/toast';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import type { Expense } from '@/types/api';

export default function TripDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { data: trip, isLoading, error, refetch } = useGroup(id!);
  const deleteGroup = useDeleteGroup();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!trip) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${trip.name}"? This action cannot be undone and will remove all expenses and data associated with this trip.`
    );

    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      await deleteGroup.mutateAsync(trip._id);
      toast.success('Trip deleted successfully');
      navigate('/trips');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete trip';
      toast.error(message);
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading trip details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-destructive mb-4">Failed to load trip</p>
            <Button onClick={() => navigate('/trips')}>Back to Trips</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const creatorId = typeof trip.createdBy === 'string' ? trip.createdBy : trip.createdBy._id;
  const isCreator = currentUser?._id === creatorId;
  const members = Array.isArray(trip.members) ? trip.members : [];

  // Note: In a real implementation, you would fetch expenses from the backend
  // For now, we'll show a placeholder
  const expenses: Expense[] = [];

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate('/trips')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Trips
          </Button>

          {/* Trip Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold">{trip.name}</h1>
                {isCreator && <Badge variant="secondary">Creator</Badge>}
              </div>
              {trip.description && (
                <p className="text-muted-foreground text-lg">{trip.description}</p>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" disabled={isDeleting}>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isCreator && (
                  <>
                    <EditTripDialog trip={trip} onSuccess={() => refetch()}>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit Trip
                      </DropdownMenuItem>
                    </EditTripDialog>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem destructive onClick={handleDelete}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Trip
                    </DropdownMenuItem>
                  </>
                )}
                {!isCreator && (
                  <DropdownMenuItem disabled>
                    Only the creator can edit or delete this trip
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{members.length}</div>
                <p className="text-xs text-muted-foreground">
                  People in this trip
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                <Receipt className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{expenses.length}</div>
                <p className="text-xs text-muted-foreground">
                  Expenses tracked
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
                <p className="text-xs text-muted-foreground">
                  Sum of all expenses
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Members and Expenses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MemberList trip={trip} onMemberRemoved={() => refetch()} />
            <ExpenseList
              groupId={trip._id}
              expenses={expenses}
              onExpenseAdded={() => refetch()}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
