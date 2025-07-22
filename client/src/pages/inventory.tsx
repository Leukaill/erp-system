import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Package, Sprout, Droplets, Wrench, AlertTriangle, Search, Filter } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

const inventorySchema = z.object({
  name: z.string().min(1, "Item name is required"),
  category: z.string().min(1, "Category is required"),
  currentStock: z.string().min(1, "Current stock is required"),
  minStock: z.string().min(1, "Minimum stock is required"),
  unit: z.string().min(1, "Unit is required"),
  unitPrice: z.string().optional(),
  location: z.string().optional(),
});

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  currentStock: string;
  minStock: string;
  unit: string;
  unitPrice: string | null;
  location: string | null;
  status: string;
  lastRestocked: string | null;
}

export default function Inventory() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      name: "",
      category: "",
      currentStock: "",
      minStock: "",
      unit: "",
      unitPrice: "",
      location: "",
    },
  });

  const { data: inventory, isLoading } = useQuery<InventoryItem[]>({
    queryKey: ["/api/inventory"],
  });

  const { data: lowStockItems } = useQuery<InventoryItem[]>({
    queryKey: ["/api/inventory/alerts"],
  });

  const createInventoryItemMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/inventory", {
        ...data,
        currentStock: parseFloat(data.currentStock),
        minStock: parseFloat(data.minStock),
        unitPrice: data.unitPrice ? parseFloat(data.unitPrice) : null,
        status: 'active',
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Inventory item added successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      queryClient.invalidateQueries({ queryKey: ["/api/inventory/alerts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add inventory item",
        variant: "destructive",
      });
    },
  });

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
        return 'bg-apple-red bg-opacity-10 text-apple-red border-apple-red';
      case 'low':
        return 'bg-apple-orange bg-opacity-10 text-apple-orange border-apple-orange';
      case 'active':
        return 'bg-success-green bg-opacity-10 text-success-green border-success-green';
      default:
        return 'bg-gray-500 bg-opacity-10 text-gray-500 border-gray-500';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('rw-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const filteredInventory = inventory?.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  }) || [];

  const onSubmit = (data: any) => {
    createInventoryItemMutation.mutate(data);
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
                <h1 className="text-3xl font-semibold text-apple-gray mb-2">Inventory Management</h1>
                <p className="text-gray-600">Track and manage your farm supplies and equipment</p>
              </div>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-apple-blue hover:bg-blue-600">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add Inventory Item</DialogTitle>
                    <DialogDescription>Add a new item to your inventory</DialogDescription>
                  </DialogHeader>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Item Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., NPK Fertilizer" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="seeds">Seeds</SelectItem>
                                <SelectItem value="fertilizers">Fertilizers</SelectItem>
                                <SelectItem value="pesticides">Pesticides</SelectItem>
                                <SelectItem value="equipment">Equipment</SelectItem>
                                <SelectItem value="tools">Tools</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="currentStock"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Current Stock</FormLabel>
                              <FormControl>
                                <Input placeholder="0" type="number" step="0.01" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="minStock"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Minimum Stock</FormLabel>
                              <FormControl>
                                <Input placeholder="0" type="number" step="0.01" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="unit"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Unit</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select unit" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="kg">kg</SelectItem>
                                  <SelectItem value="liters">liters</SelectItem>
                                  <SelectItem value="pieces">pieces</SelectItem>
                                  <SelectItem value="tons">tons</SelectItem>
                                  <SelectItem value="meters">meters</SelectItem>
                                  <SelectItem value="bags">bags</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="unitPrice"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Unit Price (RWF)</FormLabel>
                              <FormControl>
                                <Input placeholder="0" type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Storage Location (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Warehouse A, Sector 3" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-end space-x-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit"
                          disabled={createInventoryItemMutation.isPending}
                          className="bg-apple-blue hover:bg-blue-600"
                        >
                          {createInventoryItemMutation.isPending ? "Adding..." : "Add Item"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Search and Filters */}
          <Card className="bg-white elevated-shadow border-0 mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search inventory items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="seeds">Seeds</SelectItem>
                    <SelectItem value="fertilizers">Fertilizers</SelectItem>
                    <SelectItem value="pesticides">Pesticides</SelectItem>
                    <SelectItem value="equipment">Equipment</SelectItem>
                    <SelectItem value="tools">Tools</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Good Stock</SelectItem>
                    <SelectItem value="low">Low Stock</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all">All Inventory ({filteredInventory.length})</TabsTrigger>
              <TabsTrigger value="alerts" className="text-apple-red">
                Stock Alerts ({lowStockItems?.length || 0})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="bg-white elevated-shadow border-0">
                      <CardContent className="p-6">
                        <div className="animate-pulse">
                          <div className="h-6 bg-gray-200 rounded mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded mb-4"></div>
                          <div className="h-16 bg-gray-200 rounded mb-4"></div>
                          <div className="h-4 bg-gray-200 rounded"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : filteredInventory.length > 0 ? (
                  filteredInventory.map((item) => {
                    const Icon = getCategoryIcon(item.category);
                    const currentStock = parseFloat(item.currentStock);
                    const minStock = parseFloat(item.minStock);
                    const stockPercentage = Math.min((currentStock / minStock) * 100, 100);
                    
                    return (
                      <Card key={item.id} className="bg-white elevated-shadow border-0 hover:shadow-lg transition-shadow duration-200">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                              <Icon className="text-apple-gray" />
                            </div>
                            <Badge className={getStatusColor(item.status)}>
                              {item.status === 'critical' ? 'Critical' : 
                               item.status === 'low' ? 'Low' : 'Good'}
                            </Badge>
                          </div>
                          
                          <h3 className="text-lg font-semibold text-apple-gray mb-1">{item.name}</h3>
                          <p className="text-sm text-gray-500 capitalize mb-4">{item.category}</p>
                          
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Stock Level</span>
                                <span className="font-medium">
                                  {currentStock} / {minStock} {item.unit}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all duration-300 ${
                                    item.status === 'critical' ? 'bg-apple-red' :
                                    item.status === 'low' ? 'bg-apple-orange' : 'bg-success-green'
                                  }`}
                                  style={{ width: `${Math.max(stockPercentage, 5)}%` }}
                                />
                              </div>
                            </div>
                            
                            {item.unitPrice && (
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Unit Price</span>
                                <span className="text-sm font-medium text-apple-blue">
                                  {formatCurrency(parseFloat(item.unitPrice))}
                                </span>
                              </div>
                            )}
                            
                            {item.location && (
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Location</span>
                                <span className="text-sm font-medium text-gray-700">{item.location}</span>
                              </div>
                            )}
                            
                            <div className="pt-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className={`w-full ${
                                  item.status === 'critical' ? 'text-apple-red border-apple-red hover:bg-apple-red hover:text-white' :
                                  item.status === 'low' ? 'text-apple-orange border-apple-orange hover:bg-apple-orange hover:text-white' :
                                  'text-apple-blue border-apple-blue hover:bg-apple-blue hover:text-white'
                                }`}
                              >
                                {item.status === 'critical' ? 'Reorder Now' : 
                                 item.status === 'low' ? 'Reorder Soon' : 'Update Stock'}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                ) : (
                  <div className="col-span-full text-center py-12">
                    <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-apple-gray mb-2">No inventory items found</h3>
                    <p className="text-gray-600 mb-4">Add your first inventory item to start tracking</p>
                    <Button 
                      onClick={() => setIsDialogOpen(true)}
                      className="bg-apple-blue hover:bg-blue-600"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add First Item
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="alerts">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lowStockItems && lowStockItems.length > 0 ? (
                  lowStockItems.map((item) => {
                    const Icon = getCategoryIcon(item.category);
                    const currentStock = parseFloat(item.currentStock);
                    const minStock = parseFloat(item.minStock);
                    
                    return (
                      <Card key={item.id} className={`elevated-shadow border-2 ${getStatusColor(item.status)}`}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 ${getStatusColor(item.status)} bg-opacity-10 rounded-xl flex items-center justify-center`}>
                              <Icon className={`${getStatusColor(item.status).split(' ')[2]}`} />
                            </div>
                            <AlertTriangle className="h-5 w-5 text-apple-red" />
                          </div>
                          
                          <h3 className="text-lg font-semibold text-apple-gray mb-1">{item.name}</h3>
                          <p className="text-sm text-gray-500 capitalize mb-4">{item.category}</p>
                          
                          <div className="text-center p-4 bg-red-50 rounded-lg mb-4">
                            <p className="text-sm text-gray-600">Current Stock</p>
                            <p className="text-2xl font-bold text-apple-red">{currentStock} {item.unit}</p>
                            <p className="text-xs text-gray-500">Minimum: {minStock} {item.unit}</p>
                          </div>
                          
                          <Button className="w-full bg-apple-red hover:bg-red-600 text-white">
                            {item.status === 'critical' ? 'Urgent Reorder' : 'Reorder Now'}
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })
                ) : (
                  <div className="col-span-full text-center py-12">
                    <div className="w-16 h-16 bg-success-green bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="h-8 w-8 text-success-green" />
                    </div>
                    <h3 className="text-lg font-medium text-apple-gray mb-2">All inventory levels are good</h3>
                    <p className="text-gray-600">No items need restocking at this time</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}