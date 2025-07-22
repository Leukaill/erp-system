import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import MetricsGrid from "@/components/dashboard/metrics-grid";
import FinancialChart from "@/components/dashboard/financial-chart";
import ActivityFeed from "@/components/dashboard/activity-feed";
import ProjectsList from "@/components/dashboard/projects-list";
import InventoryAlerts from "@/components/dashboard/inventory-alerts";
import FarmMap from "@/components/dashboard/farm-map";
import WeatherTasks from "@/components/dashboard/weather-tasks";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "Please sign in to access your dashboard",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/auth";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-apple-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your farm dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-apple-gray mb-2">
              Good morning, {(user as any)?.firstName || 'Farm Manager'}
            </h1>
            <p className="text-gray-600">
              Here's your farm overview for today, {new Date().toLocaleDateString('en-RW', { 
                weekday: 'long',
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          <MetricsGrid />

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <FinancialChart />
            </div>
            <ActivityFeed />
          </div>

          {/* Projects and Inventory Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ProjectsList />
            <InventoryAlerts />
          </div>

          {/* Farm Operations and Weather */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <FarmMap />
            </div>
            <WeatherTasks />
          </div>
        </main>
      </div>
    </div>
  );
}
