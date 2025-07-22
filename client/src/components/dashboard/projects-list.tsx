import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

interface Project {
  id: number;
  name: string;
  description: string;
  type: string;
  location: string;
  status: string;
  progress: number;
  endDate: string;
  imageUrl: string | null;
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'active':
      return 'default';
    case 'completed':
      return 'secondary';
    case 'on_hold':
      return 'destructive';
    default:
      return 'outline';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'text-success-green bg-success-green';
    case 'completed':
      return 'text-apple-blue bg-apple-blue';
    case 'on_hold':
      return 'text-apple-orange bg-apple-orange';
    default:
      return 'text-gray-500 bg-gray-500';
  }
};

const getProgressColor = (progress: number) => {
  if (progress >= 80) return 'bg-success-green';
  if (progress >= 50) return 'bg-apple-blue';
  if (progress >= 25) return 'bg-apple-orange';
  return 'bg-apple-red';
};

export default function ProjectsList() {
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  if (isLoading) {
    return (
      <Card className="bg-white elevated-shadow border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-28" />
          </div>
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="border border-light-gray rounded-xl p-4">
                <Skeleton className="h-5 w-48 mb-3" />
                <Skeleton className="h-32 w-full mb-3" />
                <div className="flex justify-between mb-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-2 w-full" />
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
          <h2 className="text-xl font-semibold text-apple-gray">Active Projects</h2>
          <Button className="bg-apple-blue hover:bg-blue-600 text-sm">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>
        
        <div className="space-y-4">
          {projects && projects.length > 0 ? (
            projects.slice(0, 2).map((project) => (
              <div 
                key={project.id} 
                className="border border-light-gray rounded-xl p-4 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-apple-gray">{project.name}</h3>
                  <Badge 
                    variant={getStatusVariant(project.status)}
                    className={`${getStatusColor(project.status)} bg-opacity-10 text-xs`}
                  >
                    {project.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                </div>
                
                {/* Project Image */}
                <div className="w-full h-32 bg-gradient-to-br from-organic-green to-earth-brown rounded-lg mb-3 overflow-hidden">
                  {project.imageUrl ? (
                    <img 
                      src={project.imageUrl} 
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div 
                      className="w-full h-full bg-cover bg-center"
                      style={{
                        backgroundImage: project.type === 'coffee' 
                          ? "url('https://images.unsplash.com/photo-1447933601403-0c6688de566e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200')"
                          : "url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200')"
                      }}
                    />
                  )}
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <span><MapPin className="inline mr-1 h-3 w-3" />{project.location}</span>
                  <span>
                    <Calendar className="inline mr-1 h-3 w-3" />
                    Due: {project.endDate ? format(new Date(project.endDate), 'MMM d, yyyy') : 'Not set'}
                  </span>
                </div>
                
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`${getProgressColor(project.progress)} h-1.5 rounded-full transition-all duration-300`} 
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="text-gray-400" />
              </div>
              <p className="text-gray-500">No active projects</p>
              <p className="text-sm text-gray-400 mt-1">Create your first project to get started</p>
              <Button className="mt-4 bg-apple-blue hover:bg-blue-600">
                <Plus className="mr-2 h-4 w-4" />
                Create Project
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
