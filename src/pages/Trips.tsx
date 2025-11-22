import { useGroups } from "@/hooks/useApi";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TripCard from "@/components/trips/TripCard";
import CreateTripDialog from "@/components/trips/CreateTripDialog";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin } from "lucide-react";

export default function Trips() {
  const { data: trips, isLoading, error, refetch } = useGroups();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div className="text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">My Groups</h1>
              <p className="text-muted-foreground">
                Manage your group trips and track expenses
              </p>
            </div>
            <CreateTripDialog onSuccess={() => refetch()}>
              <Button size="lg">Create New Trip</Button>
            </CreateTripDialog>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading your trips...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="text-destructive mb-4">Error loading trips</div>
              <Button onClick={() => refetch()} variant="outline">
                Try Again
              </Button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && (!trips || trips.length === 0) && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <MapPin className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">No trips yet</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                Create your first group trip to start tracking and splitting
                expenses with friends and family.
              </p>
              <CreateTripDialog onSuccess={() => refetch()}>
                <Button size="lg">Create Your First Trip</Button>
              </CreateTripDialog>
            </div>
          )}

          {/* Trips Grid */}
          {!isLoading && !error && trips && trips.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip) => (
                <TripCard key={trip._id} trip={trip} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
