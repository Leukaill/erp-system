import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Activity, Users, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

interface Task {
  id: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  assignedTo: string;
  dueDate: string;
}

interface FarmSector {
  id: number;
  name: string;
  area: string;
  location: string;
  cropType: string;
  status: string;
}

interface Activity {
  id: number;
  type: string;
  title: string;
  description: string;
  priority: string;
  timestamp: string;
}

export default function FarmOperations() {
  const { data: tasks, isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const { data: todayTasks, isLoading: todayTasksLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks/today"],
  });

  const { data: farmSectors, isLoading: sectorsLoading } = useQuery<FarmSector[]>({
    queryKey: ["/api/farm-sectors"],
  });

  const { data: activities, isLoading: activitiesLoading } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-apple-red bg-opacity-10 text-apple-red border-apple-red';
      case 'high':
        return 'bg-apple-orange bg-opacity-10 text-apple-orange border-apple-orange';
      case 'medium':
        return 'bg-apple-blue bg-opacity-10 text-apple-blue border-apple-blue';
      case 'low':
        return 'bg-success-green bg-opacity-10 text-success-green border-success-green';
      default:
        return 'bg-gray-500 bg-opacity-10 text-gray-500 border-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success-green bg-opacity-10 text-success-green';
      case 'in_progress':
        return 'bg-apple-blue bg-opacity-10 text-apple-blue';
      case 'pending':
        return 'bg-apple-orange bg-opacity-10 text-apple-orange';
      case 'overdue':
        return 'bg-apple-red bg-opacity-10 text-apple-red';
      default:
        return 'bg-gray-500 bg-opacity-10 text-gray-500';
    }
  };

  const getSectorStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success-green bg-opacity-10 text-success-green';
      case 'maintenance':
        return 'bg-apple-orange bg-opacity-10 text-apple-orange';
      case 'inactive':
        return 'bg-gray-500 bg-opacity-10 text-gray-500';
      default:
        return 'bg-apple-blue bg-opacity-10 text-apple-blue';
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-semibold text-apple-gray mb-2">Farm Operations</h1>
                <p className="text-gray-600">Monitor daily operations and farm sector management</p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tasks">Tasks ({tasks?.length || 0})</TabsTrigger>
              <TabsTrigger value="sectors">Farm Sectors ({farmSectors?.length || 0})</TabsTrigger>
              <TabsTrigger value="activities">Activity Feed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              {/* Today's Tasks */}
              <Card className="bg-white elevated-shadow border-0">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-apple-gray mb-4 flex items-center">
                    <Clock className="mr-2 h-5 w-5" />
                    Today's Priority Tasks
                  </h2>
                  
                  {todayTasksLoading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-16 bg-gray-200 rounded-lg"></div>
                        </div>
                      ))}
                    </div>
                  ) : todayTasks && todayTasks.length > 0 ? (
                    <div className="space-y-3">
                      {todayTasks.slice(0, 5).map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${
                              task.priority === 'critical' ? 'bg-apple-red' :
                              task.priority === 'high' ? 'bg-apple-orange' :
                              task.priority === 'medium' ? 'bg-apple-blue' : 'bg-success-green'
                            }`} />
                            <div>
                              <h3 className="font-medium text-apple-gray">{task.title}</h3>
                              <p className="text-sm text-gray-600">{task.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(task.status)}>
                              {task.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Badge>
                            <Button variant="ghost" size="sm">
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircle2 className="mx-auto h-12 w-12 text-success-green mb-4" />
                      <p className="text-gray-600">No tasks scheduled for today</p>
                      <p className="text-sm text-gray-500 mt-1">Great job staying on top of your work!</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Farm Sectors Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sectorsLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="bg-white elevated-shadow border-0">
                      <CardContent className="p-6">
                        <div className="animate-pulse">
                          <div className="h-6 bg-gray-200 rounded mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded mb-4"></div>
                          <div className="h-20 bg-gray-200 rounded"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : farmSectors && farmSectors.length > 0 ? (
                  farmSectors.slice(0, 6).map((sector) => (
                    <Card key={sector.id} className="bg-white elevated-shadow border-0 hover:shadow-lg transition-shadow duration-200">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 bg-organic-green bg-opacity-10 rounded-xl flex items-center justify-center">
                            <MapPin className="text-organic-green" />
                          </div>
                          <Badge className={getSectorStatusColor(sector.status)}>
                            {sector.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-apple-gray mb-2">{sector.name}</h3>
                        
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex justify-between">
                            <span>Area</span>
                            <span className="font-medium">{sector.area} hectares</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Crop Type</span>
                            <span className="font-medium capitalize">{sector.cropType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Location</span>
                            <span className="font-medium text-right">{sector.location}</span>
                          </div>
                        </div>
                        
                        <Button variant="ghost" size="sm" className="w-full mt-4 text-apple-blue hover:text-blue-600">
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="col-span-full bg-white elevated-shadow border-0">
                    <CardContent className="p-12 text-center">
                      <MapPin className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-apple-gray mb-2">No farm sectors configured</h3>
                      <p className="text-gray-600">Set up your farm sectors to start tracking operations</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="tasks">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {tasksLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} className="bg-white elevated-shadow border-0">
                      <CardContent className="p-6">
                        <div className="animate-pulse">
                          <div className="h-6 bg-gray-200 rounded mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded mb-4"></div>
                          <div className="h-16 bg-gray-200 rounded"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : tasks && tasks.length > 0 ? (
                  tasks.map((task) => (
                    <Card key={task.id} className="bg-white elevated-shadow border-0 hover:shadow-lg transition-shadow duration-200">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Priority
                          </Badge>
                          <Badge className={getStatusColor(task.status)}>
                            {task.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-apple-gray mb-2">{task.title}</h3>
                        <p className="text-gray-600 mb-4">{task.description}</p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            Assigned to you
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            {format(new Date(task.dueDate), 'MMM dd, yyyy HH:mm')}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 mt-4">
                          <Button variant="outline" size="sm" className="flex-1">
                            Update Status
                          </Button>
                          <Button size="sm" className="flex-1 bg-success-green hover:bg-green-600">
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Complete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="col-span-full bg-white elevated-shadow border-0">
                    <CardContent className="p-12 text-center">
                      <CheckCircle2 className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-apple-gray mb-2">No tasks assigned</h3>
                      <p className="text-gray-600">All caught up! New tasks will appear here</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="sectors">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sectorsLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="bg-white elevated-shadow border-0">
                      <CardContent className="p-6">
                        <div className="animate-pulse">
                          <div className="h-6 bg-gray-200 rounded mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded mb-4"></div>
                          <div className="h-20 bg-gray-200 rounded"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : farmSectors && farmSectors.length > 0 ? (
                  farmSectors.map((sector) => (
                    <Card key={sector.id} className="bg-white elevated-shadow border-0 hover:shadow-lg transition-shadow duration-200">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 bg-organic-green bg-opacity-10 rounded-xl flex items-center justify-center">
                            <MapPin className="text-organic-green" />
                          </div>
                          <Badge className={getSectorStatusColor(sector.status)}>
                            {sector.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-apple-gray mb-2">{sector.name}</h3>
                        
                        <div className="h-32 bg-gradient-to-br from-organic-green to-earth-brown rounded-lg mb-4 overflow-hidden">
                          <div 
                            className="w-full h-full bg-cover bg-center"
                            style={{
                              backgroundImage: sector.cropType === 'coffee' 
                                ? "url('https://images.unsplash.com/photo-1447933601403-0c6688de566e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200')"
                                : sector.cropType === 'maize'
                                ? "url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200')"
                                : "url('https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200')"
                            }}
                          />
                        </div>
                        
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Area</span>
                            <span className="font-medium text-apple-gray">{sector.area} hectares</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Crop Type</span>
                            <span className="font-medium text-apple-gray capitalize">{sector.cropType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Location</span>
                            <span className="font-medium text-apple-gray text-right">{sector.location}</span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 mt-4">
                          <Button variant="outline" size="sm" className="flex-1">
                            Edit
                          </Button>
                          <Button size="sm" className="flex-1 bg-apple-blue hover:bg-blue-600">
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="col-span-full bg-white elevated-shadow border-0">
                    <CardContent className="p-12 text-center">
                      <MapPin className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-apple-gray mb-2">No farm sectors configured</h3>
                      <p className="text-gray-600 mb-4">Set up your farm sectors to start tracking operations</p>
                      <Button className="bg-apple-blue hover:bg-blue-600">
                        Add Farm Sector
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="activities">
              <Card className="bg-white elevated-shadow border-0">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-apple-gray mb-6 flex items-center">
                    <Activity className="mr-2 h-5 w-5" />
                    Recent Farm Activities
                  </h2>
                  
                  {activitiesLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-16 bg-gray-200 rounded-lg"></div>
                        </div>
                      ))}
                    </div>
                  ) : activities && activities.length > 0 ? (
                    <div className="space-y-4">
                      {activities.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            activity.priority === 'high' ? 'bg-apple-red bg-opacity-10' :
                            activity.priority === 'medium' ? 'bg-apple-blue bg-opacity-10' :
                            'bg-success-green bg-opacity-10'
                          }`}>
                            {activity.type === 'project_update' ? (
                              <Activity className={`h-5 w-5 ${
                                activity.priority === 'high' ? 'text-apple-red' :
                                activity.priority === 'medium' ? 'text-apple-blue' :
                                'text-success-green'
                              }`} />
                            ) : activity.type === 'inventory_alert' ? (
                              <AlertCircle className={`h-5 w-5 ${
                                activity.priority === 'high' ? 'text-apple-red' :
                                activity.priority === 'medium' ? 'text-apple-blue' :
                                'text-success-green'
                              }`} />
                            ) : (
                              <CheckCircle2 className={`h-5 w-5 ${
                                activity.priority === 'high' ? 'text-apple-red' :
                                activity.priority === 'medium' ? 'text-apple-blue' :
                                'text-success-green'
                              }`} />
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="font-medium text-apple-gray">{activity.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              {format(new Date(), 'MMM dd, yyyy HH:mm')}
                            </p>
                          </div>
                          
                          <Badge className={getPriorityColor(activity.priority)}>
                            {activity.priority.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Activity className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-apple-gray mb-2">No recent activities</h3>
                      <p className="text-gray-600">Farm activities will appear here as they happen</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}