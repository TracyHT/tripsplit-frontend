import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Receipt, TrendingUp, DollarSign } from 'lucide-react';
import CreateTripDialog from '@/components/trips/CreateTripDialog';
import { useGroups } from '@/hooks/useApi';
import type { Expense, Group } from '@/types/api';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: trips, refetch } = useGroups();

  // Calculate expense statistics
  const { totalExpenses, youOwe, owedToYou } = useMemo(() => {
    if (!trips || !user) {
      return { totalExpenses: 0, youOwe: 0, owedToYou: 0 };
    }

    let total = 0;
    let owe = 0;
    let owed = 0;

    trips.forEach((trip: Group) => {
      const expenses = trip.expenses_ids || [];

      expenses.forEach((expense) => {
        // Skip if expense is just an ID string (not populated)
        if (typeof expense === 'string') return;

        const exp = expense as Expense;
        const amount = exp.amount || 0;
        total += amount;

        // Get IDs from paid_by and paid_for arrays
        const paidByIds = (exp.paid_by || []).map(p =>
          typeof p === 'string' ? p : p._id
        );
        const paidForIds = (exp.paid_for || []).map(p =>
          typeof p === 'string' ? p : p._id
        );

        const userPaid = paidByIds.includes(user._id);
        const userIncluded = paidForIds.includes(user._id);
        const splitCount = paidForIds.length || 1;
        const perPersonAmount = amount / splitCount;

        if (userPaid && !userIncluded) {
          // User paid but isn't in the split - others owe them the full amount
          owed += amount;
        } else if (userPaid && userIncluded) {
          // User paid and is in the split - others owe them their shares
          owed += amount - perPersonAmount;
        } else if (!userPaid && userIncluded) {
          // User didn't pay but is in the split - they owe their share
          owe += perPersonAmount;
        }
      });
    });

    return { totalExpenses: total, youOwe: owe, owedToYou: owed };
  }, [trips, user]);

  // Get recent expenses across all trips
  const recentExpenses = useMemo(() => {
    if (!trips) return [];

    const allExpenses: Array<{
      expense: Expense;
      tripName: string;
      tripId: string;
    }> = [];

    trips.forEach((trip: Group) => {
      const expenses = trip.expenses_ids || [];
      expenses.forEach((expense) => {
        if (typeof expense === 'string') return;
        allExpenses.push({
          expense: expense as Expense,
          tripName: trip.name,
          tripId: trip._id,
        });
      });
    });

    // Sort by createdAt descending and take top 5
    return allExpenses
      .sort((a, b) =>
        new Date(b.expense.createdAt).getTime() - new Date(a.expense.createdAt).getTime()
      )
      .slice(0, 5);
  }, [trips]);

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const stats = [
    {
      title: 'Active Trips',
      value: trips?.length?.toString() || '0',
      icon: Users,
      description: 'Current group trips',
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(totalExpenses),
      icon: Receipt,
      description: 'All-time expenses',
    },
    {
      title: 'You Owe',
      value: formatCurrency(youOwe),
      icon: TrendingUp,
      description: 'Outstanding balance',
    },
    {
      title: 'Owed to You',
      value: formatCurrency(owedToYou),
      icon: DollarSign,
      description: 'Pending settlements',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome back, {user?.name || 'User'}!
            </h1>
            <p className="text-muted-foreground">
              Here's an overview of your trip expenses
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Get started with your expense tracking
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              <CreateTripDialog onSuccess={() => refetch()}>
                <Button>Create New Trip</Button>
              </CreateTripDialog>
              <Button variant="outline" onClick={() => navigate('/trips')}>View All Trips</Button>
              <Button variant="outline" onClick={() => navigate('/trips')}>Settle Up</Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest expense updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentExpenses.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No recent activity</p>
                  <p className="text-sm mt-2">
                    Start by creating a trip or adding an expense
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentExpenses.map(({ expense, tripName, tripId }) => {
                    const paidByUser = expense.paid_by?.[0];
                    const paidByName = typeof paidByUser === 'string'
                      ? 'Unknown'
                      : paidByUser?.name || 'Unknown';

                    return (
                      <div
                        key={expense._id}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-primary/5 transition-colors cursor-pointer"
                        onClick={() => navigate(`/trips/${tripId}`)}
                      >
                        <div className="flex items-center gap-3 text-left">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Receipt className="h-5 w-5 text-primary" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-left">{expense.description}</p>
                            <p className="text-sm text-muted-foreground text-left">
                              {tripName} · Paid by {paidByName}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(expense.amount)}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(expense.createdAt)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
