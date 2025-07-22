import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, BarChart3 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  profit: number;
  transactions: Array<{
    id: number;
    type: string;
    amount: string;
    date: string;
    category: string;
  }>;
}

export default function FinancialChart() {
  const [timeRange, setTimeRange] = useState("12");
  
  const { data: summary, isLoading } = useQuery<FinancialSummary>({
    queryKey: ["/api/financial/summary", { months: timeRange }],
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('rw-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <Card className="bg-white elevated-shadow border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-6 w-48" />
            <div className="flex items-center space-x-3">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
          <Skeleton className="h-80 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white elevated-shadow border-0">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-apple-gray">Financial Overview (RWF)</h2>
          <div className="flex items-center space-x-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">Last 3 months</SelectItem>
                <SelectItem value="6">Last 6 months</SelectItem>
                <SelectItem value="12">Last 12 months</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Chart Container */}
        <div className="chart-container rounded-xl p-8 h-80 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
          {/* Background landscape */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-10"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400')"
            }}
          />
          <div className="relative z-10 text-center">
            <BarChart3 className="text-4xl text-apple-blue mb-4 mx-auto" />
            <p className="text-gray-600 font-medium mb-2">Financial Chart Component</p>
            <p className="text-sm text-gray-500">Revenue vs Expenses visualization</p>
            {summary && (
              <div className="mt-4 space-y-2">
                <p className="text-lg font-semibold text-success-green">
                  Revenue: {formatCurrency(summary.totalRevenue)}
                </p>
                <p className="text-lg font-semibold text-apple-red">
                  Expenses: {formatCurrency(summary.totalExpenses)}
                </p>
                <p className={`text-lg font-semibold ${
                  summary.profit >= 0 ? 'text-success-green' : 'text-apple-red'
                }`}>
                  Profit: {formatCurrency(summary.profit)}
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Chart Legend */}
        <div className="flex items-center justify-center space-x-8 mt-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success-green rounded-full"></div>
            <span className="text-sm text-gray-600">Revenue</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-apple-red rounded-full"></div>
            <span className="text-sm text-gray-600">Expenses</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-apple-blue rounded-full"></div>
            <span className="text-sm text-gray-600">Profit</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
