import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Map, Expand } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface FarmSector {
  id: number;
  name: string;
  area: string;
  status: string;
  cropType: string | null;
}

export default function FarmMap() {
  const { data: sectors, isLoading } = useQuery<FarmSector[]>({
    queryKey: ["/api/farm-sectors"],
  });

  const activeSectors = sectors?.filter(s => s.status === 'active').length || 0;
  const totalArea = sectors?.reduce((sum, sector) => sum + parseFloat(sector.area), 0) || 0;

  if (isLoading) {
    return (
      <Card className="bg-white elevated-shadow border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-6 w-48" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-6 w-20" />
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
          <h2 className="text-xl font-semibold text-apple-gray">Farm Operations Overview</h2>
          <div className="flex items-center space-x-2">
            <Badge className="bg-apple-blue bg-opacity-10 text-apple-blue text-sm">
              Live View
            </Badge>
            <Button variant="ghost" size="sm">
              <Expand className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Map Container */}
        <div className="relative h-80 bg-gradient-to-br from-organic-green to-earth-brown rounded-xl overflow-hidden">
          {/* Beautiful aerial view of Rwandan agricultural terraces */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-90"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600')"
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-30" />
          
          {/* Map Overlays */}
          <div className="absolute top-4 left-4 space-y-2">
            <div className="glass-effect rounded-lg p-3 text-white">
              <p className="text-sm font-medium">
                Active Sectors: {activeSectors}/{sectors?.length || 0}
              </p>
              <p className="text-xs opacity-80">
                {totalArea.toFixed(0)} hectares monitored
              </p>
            </div>
          </div>
          
          <div className="absolute bottom-4 right-4 space-y-2">
            <div className="glass-effect rounded-lg p-3 text-white text-center">
              <p className="text-xs opacity-80">Real-time Data</p>
              <p className="text-sm font-medium">Updated 2 min ago</p>
            </div>
          </div>
          
          {/* Interactive Markers */}
          <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-success-green rounded-full pulse-animation border-2 border-white shadow-lg" />
          <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-apple-blue rounded-full pulse-animation border-2 border-white shadow-lg" />
          <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-warm-orange rounded-full pulse-animation border-2 border-white shadow-lg" />
          
          {/* Center Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="glass-effect rounded-xl p-4 text-white text-center">
              <Map className="text-2xl mb-2 mx-auto" />
              <p className="text-sm font-medium">Interactive Farm Map</p>
              <p className="text-xs opacity-80">Click markers for details</p>
            </div>
          </div>
        </div>
        
        {/* Map Legend */}
        <div className="flex items-center justify-between mt-4 text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success-green rounded-full" />
              <span className="text-gray-600">Harvesting</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-apple-blue rounded-full" />
              <span className="text-gray-600">Irrigation</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-warm-orange rounded-full" />
              <span className="text-gray-600">Maintenance</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-apple-blue hover:text-blue-600 text-sm font-medium">
            View Full Map
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
