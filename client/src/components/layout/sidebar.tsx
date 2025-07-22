import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  BarChart3, 
  Wallet, 
  FolderKanban, 
  Package, 
  Tractor, 
  Users, 
  Bus, 
  FileBarChart,
  Sprout,
  ChevronRight
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const navigationItems = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Financial Management", href: "/finance", icon: Wallet },
  { name: "Project Management", href: "/projects", icon: FolderKanban },
  { name: "Inventory Management", href: "/inventory", icon: Package },
  { name: "Farm Operations", href: "/farm-operations", icon: Tractor },
  { name: "Customer Relations", href: "/customer-relations", icon: Users },
  { name: "Human Resources", href: "/human-resources", icon: Bus },
  { name: "Reports & Analytics", href: "/reports", icon: FileBarChart },
];

export default function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto glass-effect border-r border-light-gray">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-6 mb-8">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-apple-blue to-professional-blue rounded-xl flex items-center justify-center">
                <Sprout className="text-white text-lg" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-semibold text-apple-gray">AgriFlow</h1>
                <p className="text-sm text-gray-500">ERP System</p>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-3 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              
              return (
                <Link key={item.name} href={item.href}>
                  <div className={`nav-item group flex items-center px-3 py-3 text-sm font-medium rounded-xl cursor-pointer ${
                    isActive 
                      ? "bg-apple-blue bg-opacity-10 text-apple-blue" 
                      : "text-gray-700 hover:text-apple-blue"
                  }`}>
                    <Icon className="mr-3 text-base" />
                    {item.name}
                  </div>
                </Link>
              );
            })}
          </nav>
          
          {/* User Profile */}
          <div className="flex-shrink-0 px-3 mt-4">
            <div className="flex items-center p-3 bg-white rounded-xl card-shadow">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-apple-blue to-professional-blue flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {(user as any)?.firstName?.charAt(0) || (user as any)?.email?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <p className="text-sm font-medium text-apple-gray">
                  {(user as any)?.firstName && (user as any)?.lastName 
                    ? `${(user as any).firstName} ${(user as any).lastName}`
                    : (user as any)?.email
                  }
                </p>
                <p className="text-xs text-gray-500">
                  {(user as any)?.role?.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'Farm Manager'}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="p-1 h-auto"
              >
                <ChevronRight className="text-gray-400 text-sm" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
