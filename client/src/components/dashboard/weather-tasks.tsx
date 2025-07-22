import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Sun, Clock, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";

interface Task {
  id: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  dueDate: string;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'critical':
      return 'text-apple-red bg-apple-red';
    case 'high':
      return 'text-warm-orange bg-warm-orange';
    case 'medium':
      return 'text-apple-blue bg-apple-blue';
    case 'low':
      return 'text-success-green bg-success-green';
    default:
      return 'text-gray-500 bg-gray-500';
  }
};

export default function WeatherTasks() {
  const queryClient = useQueryClient();
  
  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks/today"],
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: any }) => {
      await apiRequest("PUT", `/api/tasks/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks/today"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
    },
  });

  const handleTaskToggle = (taskId: number, completed: boolean) => {
    updateTaskMutation.mutate({
      id: taskId,
      updates: {
        status: completed ? 'completed' : 'pending'
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Weather Widget */}
      <Card className="bg-gradient-to-br from-apple-blue to-professional-blue text-white elevated-shadow border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Today's Weather</h3>
            <Sun className="text-yellow-300 text-xl" />
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold mb-1">24°C</p>
            <p className="text-sm opacity-80 mb-3">Partly Cloudy</p>
            <div className="flex items-center justify-between text-sm">
              <div className="text-center">
                <p className="opacity-80">Humidity</p>
                <p className="font-medium">68%</p>
              </div>
              <div className="text-center">
                <p className="opacity-80">Wind</p>
                <p className="font-medium">12 km/h</p>
              </div>
              <div className="text-center">
                <p className="opacity-80">Rain</p>
                <p className="font-medium">20%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Tasks */}
      <Card className="bg-white elevated-shadow border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-apple-gray">Today's Tasks</h3>
            <Button variant="ghost" size="sm" className="text-apple-blue font-medium">
              View All
            </Button>
          </div>
          
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3 p-3">
                  <Skeleton className="w-4 h-4" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-48 mb-1" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="w-12 h-5" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {tasks && tasks.length > 0 ? (
                tasks.map((task) => {
                  const colorClasses = getPriorityColor(task.priority);
                  const isCompleted = task.status === 'completed';
                  
                  return (
                    <div 
                      key={task.id} 
                      className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    >
                      <Checkbox
                        checked={isCompleted}
                        onCheckedChange={(checked) => handleTaskToggle(task.id, !!checked)}
                        className="w-4 h-4"
                      />
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${
                          isCompleted ? 'text-gray-400 line-through' : 'text-apple-gray'
                        }`}>
                          {task.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {isCompleted 
                            ? 'Completed' 
                            : task.dueDate 
                              ? `Due: ${format(new Date(task.dueDate), 'h:mm a')}`
                              : 'No due time'
                          }
                        </p>
                      </div>
                      <Badge
                        className={`${colorClasses} bg-opacity-10 text-xs`}
                      >
                        {isCompleted 
                          ? 'Done' 
                          : task.priority.charAt(0).toUpperCase() + task.priority.slice(1)
                        }
                      </Badge>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-success-green bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="text-success-green" />
                  </div>
                  <p className="text-gray-600 font-medium">All tasks completed!</p>
                  <p className="text-sm text-gray-400 mt-1">Great job on staying productive</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
