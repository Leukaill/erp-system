import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { FileText, Download, Calendar, TrendingUp, DollarSign, Package, Users, Activity } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState("12months");
  const [selectedReport, setSelectedReport] = useState("financial");

  // Sample data for demonstration
  const financialData = [
    { month: 'Jan', revenue: 1850000, expenses: 1200000, profit: 650000 },
    { month: 'Feb', revenue: 2100000, expenses: 1400000, profit: 700000 },
    { month: 'Mar', revenue: 1950000, expenses: 1300000, profit: 650000 },
    { month: 'Apr', revenue: 2250000, expenses: 1500000, profit: 750000 },
    { month: 'May', revenue: 2400000, expenses: 1600000, profit: 800000 },
    { month: 'Jun', revenue: 2150000, expenses: 1450000, profit: 700000 },
  ];

  const productionData = [
    { crop: 'Coffee', planned: 5000, actual: 4750, efficiency: 95 },
    { crop: 'Maize', planned: 8000, actual: 7200, efficiency: 90 },
    { crop: 'Vegetables', planned: 3000, actual: 3150, efficiency: 105 },
    { crop: 'Beans', planned: 2500, actual: 2300, efficiency: 92 },
  ];

  const inventoryTrends = [
    { month: 'Jan', seeds: 150, fertilizers: 200, equipment: 85 },
    { month: 'Feb', seeds: 135, fertilizers: 180, equipment: 90 },
    { month: 'Mar', seeds: 120, fertilizers: 165, equipment: 88 },
    { month: 'Apr', seeds: 140, fertilizers: 195, equipment: 92 },
    { month: 'May', seeds: 125, fertilizers: 175, equipment: 85 },
    { month: 'Jun', seeds: 130, fertilizers: 190, equipment: 90 },
  ];

  const expenseBreakdown = [
    { category: 'Seeds', amount: 2850000, percentage: 35, color: '#10B981' },
    { category: 'Fertilizers', amount: 2280000, percentage: 28, color: '#3B82F6' },
    { category: 'Equipment', amount: 1460000, percentage: 18, color: '#F59E0B' },
    { category: 'Labor', amount: 975000, percentage: 12, color: '#EF4444' },
    { category: 'Other', amount: 570000, percentage: 7, color: '#8B5CF6' },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('rw-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat().format(value);
  };

  const reportMetrics = {
    totalRevenue: financialData.reduce((sum, item) => sum + item.revenue, 0),
    totalExpenses: financialData.reduce((sum, item) => sum + item.expenses, 0),
    totalProduction: productionData.reduce((sum, item) => sum + item.actual, 0),
    averageEfficiency: Math.round(productionData.reduce((sum, item) => sum + item.efficiency, 0) / productionData.length),
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
                <h1 className="text-3xl font-semibold text-apple-gray mb-2">Reports & Analytics</h1>
                <p className="text-gray-600">Comprehensive insights into your farm's performance</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3months">Last 3 Months</SelectItem>
                    <SelectItem value="6months">Last 6 Months</SelectItem>
                    <SelectItem value="12months">Last 12 Months</SelectItem>
                    <SelectItem value="ytd">Year to Date</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white elevated-shadow border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                    <p className="text-2xl font-semibold text-success-green">
                      {formatCurrency(reportMetrics.totalRevenue)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-success-green bg-opacity-10 rounded-xl flex items-center justify-center">
                    <DollarSign className="text-success-green" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white elevated-shadow border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
                    <p className="text-2xl font-semibold text-apple-red">
                      {formatCurrency(reportMetrics.totalExpenses)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-apple-red bg-opacity-10 rounded-xl flex items-center justify-center">
                    <TrendingUp className="text-apple-red" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white elevated-shadow border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Production</p>
                    <p className="text-2xl font-semibold text-apple-blue">
                      {formatNumber(reportMetrics.totalProduction)} kg
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-apple-blue bg-opacity-10 rounded-xl flex items-center justify-center">
                    <Package className="text-apple-blue" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white elevated-shadow border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Avg. Efficiency</p>
                    <p className="text-2xl font-semibold text-apple-orange">
                      {reportMetrics.averageEfficiency}%
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-apple-orange bg-opacity-10 rounded-xl flex items-center justify-center">
                    <Activity className="text-apple-orange" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="financial" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="financial">Financial Reports</TabsTrigger>
              <TabsTrigger value="production">Production Analysis</TabsTrigger>
              <TabsTrigger value="inventory">Inventory Reports</TabsTrigger>
              <TabsTrigger value="custom">Custom Reports</TabsTrigger>
            </TabsList>
            
            <TabsContent value="financial" className="space-y-6">
              {/* Revenue vs Expenses Chart */}
              <Card className="bg-white elevated-shadow border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-apple-gray">Revenue vs Expenses Trend</h2>
                    <Button variant="ghost" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Details
                    </Button>
                  </div>
                  
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={financialData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" tickFormatter={formatCurrency} />
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        <Bar dataKey="revenue" fill="#10B981" name="Revenue" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="expenses" fill="#EF4444" name="Expenses" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Expense Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white elevated-shadow border-0">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-apple-gray mb-6">Expense Breakdown</h2>
                    
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={expenseBreakdown}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="amount"
                            label={(entry) => `${entry.category} ${entry.percentage}%`}
                          >
                            {expenseBreakdown.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white elevated-shadow border-0">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-apple-gray mb-6">Profit Trend</h2>
                    
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={financialData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="month" stroke="#6b7280" />
                          <YAxis stroke="#6b7280" tickFormatter={formatCurrency} />
                          <Tooltip formatter={(value: number) => formatCurrency(value)} />
                          <Line
                            type="monotone"
                            dataKey="profit"
                            stroke="#3B82F6"
                            strokeWidth={3}
                            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="production" className="space-y-6">
              {/* Production Performance */}
              <Card className="bg-white elevated-shadow border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-apple-gray">Production Performance by Crop</h2>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                  </div>
                  
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={productionData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="crop" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip />
                        <Bar dataKey="planned" fill="#94A3B8" name="Planned (kg)" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="actual" fill="#3B82F6" name="Actual (kg)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Production Efficiency Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {productionData.map((crop) => (
                  <Card key={crop.crop} className="bg-white elevated-shadow border-0">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-apple-gray mb-2">{crop.crop}</h3>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Planned</span>
                          <span className="font-medium">{formatNumber(crop.planned)} kg</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Actual</span>
                          <span className="font-medium">{formatNumber(crop.actual)} kg</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Efficiency</span>
                          <span className={`font-medium ${
                            crop.efficiency >= 100 ? 'text-success-green' :
                            crop.efficiency >= 90 ? 'text-apple-blue' :
                            'text-apple-orange'
                          }`}>
                            {crop.efficiency}%
                          </span>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              crop.efficiency >= 100 ? 'bg-success-green' :
                              crop.efficiency >= 90 ? 'bg-apple-blue' :
                              'bg-apple-orange'
                            }`}
                            style={{ width: `${Math.min(crop.efficiency, 100)}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="inventory" className="space-y-6">
              {/* Inventory Trends */}
              <Card className="bg-white elevated-shadow border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-apple-gray">Inventory Level Trends</h2>
                    <Button variant="ghost" size="sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      View Calendar
                    </Button>
                  </div>
                  
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={inventoryTrends}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="seeds"
                          stroke="#10B981"
                          strokeWidth={2}
                          name="Seeds (kg)"
                          dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="fertilizers"
                          stroke="#3B82F6"
                          strokeWidth={2}
                          name="Fertilizers (kg)"
                          dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="equipment"
                          stroke="#F59E0B"
                          strokeWidth={2}
                          name="Equipment (units)"
                          dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Inventory Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white elevated-shadow border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-apple-gray">Seeds Inventory</h3>
                      <div className="w-3 h-3 bg-success-green rounded-full"></div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Current Stock</span>
                        <span className="font-medium">130 kg</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Avg. Monthly Usage</span>
                        <span className="font-medium">35 kg</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Reorder Point</span>
                        <span className="font-medium">50 kg</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Status</span>
                        <span className="font-medium text-success-green">Good</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white elevated-shadow border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-apple-gray">Fertilizers</h3>
                      <div className="w-3 h-3 bg-apple-blue rounded-full"></div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Current Stock</span>
                        <span className="font-medium">190 kg</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Avg. Monthly Usage</span>
                        <span className="font-medium">45 kg</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Reorder Point</span>
                        <span className="font-medium">100 kg</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Status</span>
                        <span className="font-medium text-success-green">Good</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white elevated-shadow border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-apple-gray">Equipment</h3>
                      <div className="w-3 h-3 bg-apple-orange rounded-full"></div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Units</span>
                        <span className="font-medium">90</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">In Use</span>
                        <span className="font-medium">72</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Under Maintenance</span>
                        <span className="font-medium">8</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Utilization</span>
                        <span className="font-medium text-apple-blue">80%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="custom">
              <Card className="bg-white elevated-shadow border-0">
                <CardContent className="p-12 text-center">
                  <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-apple-gray mb-2">Custom Reports Builder</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Create custom reports by selecting specific metrics, date ranges, and visualization types
                    tailored to your farm's unique requirements.
                  </p>
                  
                  <div className="flex justify-center space-x-4">
                    <Button className="bg-apple-blue hover:bg-blue-600">
                      <FileText className="mr-2 h-4 w-4" />
                      Build Custom Report
                    </Button>
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Template Gallery
                    </Button>
                  </div>
                  
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-apple-gray mb-2">Financial Summary</h4>
                      <p className="text-sm text-gray-600">Revenue, expenses, and profit analysis</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-apple-gray mb-2">Production Report</h4>
                      <p className="text-sm text-gray-600">Crop yields and efficiency metrics</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-apple-gray mb-2">Operational Dashboard</h4>
                      <p className="text-sm text-gray-600">Tasks, attendance, and resource usage</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}