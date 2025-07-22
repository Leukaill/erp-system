import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Plus, AlertTriangle, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

interface Activity {
  id: number;
  type: string;
  title: string;
  description: string;
  priority: string;
  createdAt: string;
}

const getActivityIcon = (type: string, priority: string) => {
  switch (type) {
    case 'project_update':
      return priority === 'high' || priority === 'critical' ? AlertTriangle : Check;
    case 'inventory_alert':
      return AlertTriangle;
    case 'financial':
      return FileText;
    default:
      return Plus;
  }
};

const getActivityColor = (type: string, priority: string) => {
  if (priority === 'critical') return 'text-apple-red bg-apple-red';
  if (priority === 'high') return 'text-warm-orange bg-warm-orange';
  
  switch (type) {
    case 'project_update':
      return 'text-success-green bg-success-green';
    case 'inventory_alert':
      return 'text-warm-orange bg-warm-orange';
    case 'financial':
      return 'text-professional-blue bg-professional-blue';
    default:
      return 'text-apple-blue bg-apple-blue';
  }
};

export default function ActivityFeed() {
  const { data: activities, isLoading } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });

  if (isLoading) {
    return (
      <Card className="bg-white elevated-shadow border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3 p-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-48 mb-1" />
                  <Skeleton className="h-3 w-20" />
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
          <h2 className="text-xl font-semibold text-apple-gray">Recent Activities</h2>
          <Button variant="ghost" size="sm" className="text-apple-blue font-medium hover:text-blue-600">
            View All
          </Button>
        </div>
        
        <div className="space-y-4">
          {activities && activities.length > 0 ? (
            activities.map((activity) => {
              const Icon = getActivityIcon(activity.type, activity.priority);
              const colorClasses = getActivityColor(activity.type, activity.priority);
              
              return (
                <div 
                  key={activity.id} 
                  className="flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className={`w-8 h-8 ${colorClasses} bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`${colorClasses.split(' ')[0]} text-sm`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-apple-gray">{activity.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="text-gray-400" />
              </div>
              <p className="text-gray-500">No recent activities</p>
              <p className="text-sm text-gray-400 mt-1">Activities will appear here as they happen</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
