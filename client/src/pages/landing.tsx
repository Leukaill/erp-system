import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sprout, BarChart3, Package, Users, MapPin, TrendingUp, Folder } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/auth";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="glass-effect border-b border-light-gray px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-apple-blue to-professional-blue rounded-xl flex items-center justify-center">
              <Sprout className="text-white text-lg" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-apple-gray">AgriFlow</h1>
              <p className="text-sm text-gray-500">ERP System</p>
            </div>
          </div>
          <Button onClick={handleLogin} className="bg-apple-blue hover:bg-blue-600">
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-apple-gray mb-6">
            Premium ERP System for
            <span className="text-apple-blue"> Rwandan Farms</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Streamline your agricultural operations with our comprehensive farm management system. 
            Built for Rwandan SME farms with financial management, project planning, and inventory control.
          </p>
          <Button 
            onClick={handleLogin}
            size="lg"
            className="bg-apple-blue hover:bg-blue-600 text-lg px-8 py-3"
          >
            Get Started Today
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {/* Financial Management */}
          <Card className="metric-card bg-white elevated-shadow border-0 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-success-green rounded-xl flex items-center justify-center mb-4">
                <BarChart3 className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-apple-gray mb-3">Financial Management</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Complete financial tracking with RWF currency support, budgeting, expense tracking, 
                and detailed profit/loss analysis for your farming operations.
              </p>
            </CardContent>
          </Card>

          {/* Project Management */}
          <Card className="metric-card bg-white elevated-shadow border-0 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-apple-blue rounded-xl flex items-center justify-center mb-4">
                <Folder className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-apple-gray mb-3">Project Management</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Plan and track crop seasons, manage tasks with Gantt charts, monitor milestones, 
                and coordinate farm activities across multiple locations.
              </p>
            </CardContent>
          </Card>

          {/* Inventory Control */}
          <Card className="metric-card bg-white elevated-shadow border-0 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-warm-orange rounded-xl flex items-center justify-center mb-4">
                <Package className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-apple-gray mb-3">Inventory Control</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Track seeds, fertilizers, and equipment with automated reorder alerts. Monitor stock levels 
                and optimize inventory management.
              </p>
            </CardContent>
          </Card>

          {/* Farm Operations */}
          <Card className="metric-card bg-white elevated-shadow border-0 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-organic-green rounded-xl flex items-center justify-center mb-4">
                <Sprout className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-apple-gray mb-3">Farm Operations</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Real-time dashboard with field monitoring, harvest tracking, and integrated Rwanda crop 
                calendar for optimal farming decisions.
              </p>
            </CardContent>
          </Card>

          {/* Team Management */}
          <Card className="metric-card bg-white elevated-shadow border-0 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-professional-blue rounded-xl flex items-center justify-center mb-4">
                <Users className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-apple-gray mb-3">Team Management</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Manage farm workers, assign tasks, track performance, and handle customer relationships 
                with suppliers and buyers.
              </p>
            </CardContent>
          </Card>

          {/* Analytics & Reports */}
          <Card className="metric-card bg-white elevated-shadow border-0 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-apple-red rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-apple-gray mb-3">Analytics & Reports</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Comprehensive reporting with data visualization, export capabilities, and detailed analytics to 
                drive informed business decisions.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-apple-blue to-professional-blue rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Farm Management?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join Rwandan farmers who trust AgriFlow ERP for their agricultural success
          </p>
          <Button 
            onClick={handleLogin}
            size="lg"
            variant="secondary"
            className="bg-white text-apple-blue hover:bg-gray-100 text-lg px-8 py-3"
          >
            Start Your Journey
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-600">
            © 2024 AgriFlow ERP. Designed for Rwandan agricultural excellence.
          </p>
        </div>
      </footer>
    </div>
  );
}
