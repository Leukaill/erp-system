import { useQuery } from "@tanstack/react-query";
import { TrendingUp, FolderKanban, Package, Map } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardMetrics {
  totalRevenue: number;
  activeProjects: number;
  inventoryItems: number;
  farmArea: number;
  lowStockItems: number;
}

export default function MetricsGrid() {
  const { data: metrics, isLoading, error } = useQuery<DashboardMetrics>({
    queryKey: ["/api/dashboard/metrics"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-white">
            <CardContent className="p-6">
              <Skeleton className="h-12 w-12 rounded-xl mb-4" />
              <Skeleton className="h-8 w-24 mb-1" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white">
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">Unable to load metrics</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('rw-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Revenue Card */}
      <Card className="metric-card bg-white card-shadow border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-success-green bg-opacity-10 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-success-green text-xl" />
            </div>
            <span className="text-xs text-gray-500 bg-success-green bg-opacity-10 px-2 py-1 rounded-full">
              +12.5%
            </span>
          </div>
          <h3 className="text-2xl font-semibold text-apple-gray mb-1">
            {formatCurrency(metrics.totalRevenue)}
          </h3>
          <p className="text-sm text-gray-600">Total Revenue (RWF)</p>
          <p className="text-xs text-gray-500 mt-2">This month</p>
        </CardContent>
      </Card>

      {/* Active Projects */}
      <Card className="metric-card bg-white card-shadow border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-apple-blue bg-opacity-10 rounded-xl flex items-center justify-center">
              <FolderKanban className="text-apple-blue text-xl" />
            </div>
            <span className="text-xs text-gray-500 bg-apple-blue bg-opacity-10 px-2 py-1 rounded-full">
              {metrics.activeProjects} active
            </span>
          </div>
          <h3 className="text-2xl font-semibold text-apple-gray mb-1">
            {formatNumber(metrics.activeProjects)}
          </h3>
          <p className="text-sm text-gray-600">Active Projects</p>
          <p className="text-xs text-gray-500 mt-2">Across all locations</p>
        </CardContent>
      </Card>

      {/* Inventory Status */}
      <Card className="metric-card bg-white card-shadow border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-warm-orange bg-opacity-10 rounded-xl flex items-center justify-center">
              <Package className="text-warm-orange text-xl" />
            </div>
            <span className="text-xs text-gray-500 bg-apple-orange bg-opacity-10 px-2 py-1 rounded-full">
              {metrics.lowStockItems} low
            </span>
          </div>
          <h3 className="text-2xl font-semibold text-apple-gray mb-1">
            {formatNumber(metrics.inventoryItems)}
          </h3>
          <p className="text-sm text-gray-600">Inventory Items</p>
          <p className="text-xs text-gray-500 mt-2">
            {metrics.lowStockItems} items need reorder
          </p>
        </CardContent>
      </Card>

      {/* Farm Area */}
      <Card className="metric-card bg-white card-shadow border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-organic-green bg-opacity-10 rounded-xl flex items-center justify-center">
              <Map className="text-organic-green text-xl" />
            </div>
            <span className="text-xs text-gray-500 bg-organic-green bg-opacity-10 px-2 py-1 rounded-full">
              85% used
            </span>
          </div>
          <h3 className="text-2xl font-semibold text-apple-gray mb-1">
            {formatNumber(metrics.farmArea)}
          </h3>
          <p className="text-sm text-gray-600">Hectares Managed</p>
          <p className="text-xs text-gray-500 mt-2">Across all locations</p>
        </CardContent>
      </Card>
    </div>
  );
}
