import { useState } from "react";
import { Bell, Search, Plus, Menu, ChevronRight, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "../../hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "../../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [language, setLanguage] = useState("en");
  const { user } = useAuth();
  const { toast } = useToast();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/logout");
      return response;
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/auth/user"], null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      window.location.href = "/auth";
    },
    onError: () => {
      toast({
        title: "Logout failed",
        description: "Please try again",
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="glass-effect border-b border-light-gray px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" className="md:hidden p-2">
            <Menu className="text-apple-gray" />
          </Button>
          <nav className="flex items-center space-x-2 text-sm">
            <span className="text-gray-500">Dashboard</span>
            <ChevronRight className="text-gray-400 text-xs" />
            <span className="text-apple-gray font-medium">Overview</span>
          </nav>
        </div>
        
        {/* Search and Actions */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden sm:block relative">
            <Input 
              type="text" 
              placeholder="Search across modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-80 pl-10 bg-white border-light-gray focus:ring-2 focus:ring-apple-blue focus:border-transparent"
            />
            <Search className="absolute left-3 top-3 text-gray-400 text-sm" />
          </div>
          
          {/* Language Selector */}
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-16 bg-white border-light-gray focus:ring-2 focus:ring-apple-blue">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">EN</SelectItem>
              <SelectItem value="rw">RW</SelectItem>
              <SelectItem value="fr">FR</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative p-2 text-gray-500 hover:text-apple-blue">
            <Bell className="text-lg" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-apple-red rounded-full"></span>
          </Button>
          
          {/* Quick Actions */}
          <Button className="bg-apple-blue hover:bg-blue-600 text-sm font-medium">
            <Plus className="mr-2 h-4 w-4" />
            Quick Add
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-gray-700 hover:text-apple-blue">
                <User className="text-lg" />
                <span className="hidden md:block text-sm font-medium">
                  {user?.firstName || 'User'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-3 py-2">
                <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} disabled={logoutMutation.isPending}>
                <LogOut className="mr-2 h-4 w-4" />
                {logoutMutation.isPending ? "Logging out..." : "Logout"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
