import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sprout, Droplets, Wrench, Package } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  currentStock: string;
  minStock: string;
  unit: string;
  status: string;
}

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'seeds':
      return Sprout;
    case 'fertilizers':
      return Droplets;
    case 'equipment':
      return Wrench;
    default:
      return Package;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'critical':
      return 'text-apple-red bg-apple-red';
    case 'low':
      return 'text-apple-orange bg-apple-orange';
    case 'active':
      return 'text-success-green bg-success-green';
    default:
      return 'text-gray-500 bg-gray-500';
  }
};

const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'critical':
      return 'destructive';
    case 'low':
      return 'secondary';
    case 'active':
      return 'default';
    default:
      return 'outline';
  }
};

export default function InventoryAlerts() {
  const { data: lowStockItems, isLoading } = useQuery<InventoryItem[]>({
    queryKey: ["/api/inventory/alerts"],
  });

  if (isLoading) {
    return (
      <Card className="bg-white elevated-shadow border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 rounded-xl">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white elevated-shadow border-0">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-apple-gray">Inventory Alerts</h2>
          <Button variant="ghost" size="sm" className="text-apple-blue font-medium hover:text-blue-600">
            Manage Inventory
          </Button>
        </div>
        
        <div className="space-y-4">
          {lowStockItems && lowStockItems.length > 0 ? (
            lowStockItems.map((item) => {
              const Icon = getCategoryIcon(item.category);
              const colorClasses = getStatusColor(item.status);
              const currentStock = parseFloat(item.currentStock);
              const minStock = parseFloat(item.minStock);
              
              return (
                <div 
                  key={item.id} 
                  className={`flex items-center space-x-4 p-4 ${colorClasses} bg-opacity-5 border ${colorClasses} border-opacity-20 rounded-xl`}
                >
                  <div className={`w-12 h-12 ${colorClasses} bg-opacity-10 rounded-xl flex items-center justify-center`}>
                    <Icon className={`${colorClasses.split(' ')[0]}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-apple-gray">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      Current stock: {currentStock}{item.unit} / Minimum: {minStock}{item.unit}
                    </p>
                    <div className="flex items-center mt-2">
                      <Badge
                        variant={getStatusVariant(item.status)}
                        className={`${colorClasses} bg-opacity-10 text-xs mr-2`}
                      >
                        {item.status === 'critical' ? 'Critical' : 
                         item.status === 'low' ? 'Low' : 'Good'}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-apple-blue hover:text-blue-600 h-6 px-2 text-xs"
                      >
                        {item.status === 'critical' ? 'Reorder Now' : 'Reorder Soon'}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-success-green bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="text-success-green" />
              </div>
              <p className="text-gray-600 font-medium">All inventory levels are good</p>
              <p className="text-sm text-gray-400 mt-1">No items need restocking at this time</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
