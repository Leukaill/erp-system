import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Finance from "@/pages/finance";
import Inventory from "@/pages/inventory";
import Projects from "@/pages/projects";
import FarmOperations from "@/pages/farm-operations";
import CustomerRelations from "@/pages/customer-relations";
import HumanResources from "@/pages/human-resources";
import Reports from "@/pages/reports";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/finance" component={Finance} />
          <Route path="/projects" component={Projects} />
          <Route path="/inventory" component={Inventory} />
          <Route path="/farm-operations" component={FarmOperations} />
          <Route path="/customer-relations" component={CustomerRelations} />
          <Route path="/human-resources" component={HumanResources} />
          <Route path="/reports" component={Reports} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
