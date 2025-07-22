import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Phone, Mail, MapPin, Calendar, Star, MessageCircle, TrendingUp, ShoppingCart } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

export default function CustomerRelations() {
  const [searchQuery, setSearchQuery] = useState("");

  // Sample data for demonstration
  const customers = [
    {
      id: 1,
      name: "Kigali Cooperative Society",
      type: "cooperative",
      contact: "+250 788 123 456",
      email: "info@kigalicoop.rw",
      location: "Kigali City",
      totalOrders: 15,
      totalValue: 12500000,
      lastOrder: "2024-07-15",
      status: "active",
      rating: 5,
    },
    {
      id: 2,
      name: "Green Valley Exports",
      type: "exporter",
      contact: "+250 788 654 321",
      email: "orders@greenvalley.rw",
      location: "Musanze District",
      totalOrders: 8,
      totalValue: 8750000,
      lastOrder: "2024-07-10",
      status: "active",
      rating: 4,
    },
    {
      id: 3,
      name: "Local Market - Kimisagara",
      type: "market",
      contact: "+250 788 987 654",
      email: "kimisagara@market.rw",
      location: "Nyarugenge District",
      totalOrders: 25,
      totalValue: 6500000,
      lastOrder: "2024-07-20",
      status: "active",
      rating: 4,
    },
  ];

  const recentOrders = [
    {
      id: 1,
      customerId: 1,
      customerName: "Kigali Cooperative Society",
      product: "Arabica Coffee Beans",
      quantity: "500kg",
      value: 4250000,
      date: "2024-07-15",
      status: "delivered",
    },
    {
      id: 2,
      customerId: 3,
      customerName: "Local Market - Kimisagara",
      product: "Mixed Vegetables",
      quantity: "200kg",
      value: 350000,
      date: "2024-07-20",
      status: "in_transit",
    },
    {
      id: 3,
      customerId: 2,
      customerName: "Green Valley Exports",
      product: "Organic Maize",
      quantity: "1000kg",
      value: 1800000,
      date: "2024-07-10",
      status: "delivered",
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('rw-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getCustomerTypeColor = (type: string) => {
    switch (type) {
      case 'cooperative':
        return 'bg-apple-blue bg-opacity-10 text-apple-blue';
      case 'exporter':
        return 'bg-success-green bg-opacity-10 text-success-green';
      case 'market':
        return 'bg-apple-orange bg-opacity-10 text-apple-orange';
      default:
        return 'bg-gray-500 bg-opacity-10 text-gray-500';
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-success-green bg-opacity-10 text-success-green';
      case 'in_transit':
        return 'bg-apple-blue bg-opacity-10 text-apple-blue';
      case 'pending':
        return 'bg-apple-orange bg-opacity-10 text-apple-orange';
      case 'cancelled':
        return 'bg-apple-red bg-opacity-10 text-apple-red';
      default:
        return 'bg-gray-500 bg-opacity-10 text-gray-500';
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-semibold text-apple-gray mb-2">Customer Relations</h1>
                <p className="text-gray-600">Manage relationships with buyers, cooperatives, and partners</p>
              </div>
              
              <Button className="bg-apple-blue hover:bg-blue-600">
                <Users className="mr-2 h-4 w-4" />
                Add Customer
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white elevated-shadow border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Customers</p>
                    <p className="text-2xl font-semibold text-apple-gray">{customers.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-apple-blue bg-opacity-10 rounded-xl flex items-center justify-center">
                    <Users className="text-apple-blue" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white elevated-shadow border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Active Orders</p>
                    <p className="text-2xl font-semibold text-apple-gray">
                      {recentOrders.filter(order => order.status !== 'delivered').length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-apple-orange bg-opacity-10 rounded-xl flex items-center justify-center">
                    <ShoppingCart className="text-apple-orange" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white elevated-shadow border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Monthly Revenue</p>
                    <p className="text-2xl font-semibold text-apple-gray">
                      {formatCurrency(recentOrders.reduce((sum, order) => sum + order.value, 0))}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-success-green bg-opacity-10 rounded-xl flex items-center justify-center">
                    <TrendingUp className="text-success-green" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white elevated-shadow border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Avg. Rating</p>
                    <p className="text-2xl font-semibold text-apple-gray flex items-center">
                      {(customers.reduce((sum, customer) => sum + customer.rating, 0) / customers.length).toFixed(1)}
                      <Star className="ml-1 h-5 w-5 text-yellow-400 fill-current" />
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-400 bg-opacity-10 rounded-xl flex items-center justify-center">
                    <Star className="text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="customers" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="customers">Customers ({customers.length})</TabsTrigger>
              <TabsTrigger value="orders">Recent Orders ({recentOrders.length})</TabsTrigger>
              <TabsTrigger value="communications">Communications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="customers">
              {/* Search */}
              <Card className="bg-white elevated-shadow border-0 mb-6">
                <CardContent className="p-4">
                  <Input
                    placeholder="Search customers by name or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </CardContent>
              </Card>

              {/* Customer Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCustomers.map((customer) => (
                  <Card key={customer.id} className="bg-white elevated-shadow border-0 hover:shadow-lg transition-shadow duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <Badge className={getCustomerTypeColor(customer.type)}>
                          {customer.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Badge>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-sm font-medium">{customer.rating}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-apple-gray mb-3">{customer.name}</h3>
                      
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2" />
                          {customer.contact}
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2" />
                          {customer.email}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          {customer.location}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500">Total Orders</p>
                          <p className="text-lg font-semibold text-apple-blue">{customer.totalOrders}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Total Value</p>
                          <p className="text-lg font-semibold text-success-green">
                            {formatCurrency(customer.totalValue)}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-500 mb-4">
                        Last order: {new Date(customer.lastOrder).toLocaleDateString()}
                      </p>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Contact
                        </Button>
                        <Button size="sm" className="flex-1 bg-apple-blue hover:bg-blue-600">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="orders">
              <Card className="bg-white elevated-shadow border-0">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-apple-gray mb-6">Recent Orders</h2>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-apple-gray">Customer</th>
                          <th className="text-left py-3 px-4 font-medium text-apple-gray">Product</th>
                          <th className="text-left py-3 px-4 font-medium text-apple-gray">Quantity</th>
                          <th className="text-right py-3 px-4 font-medium text-apple-gray">Value</th>
                          <th className="text-left py-3 px-4 font-medium text-apple-gray">Date</th>
                          <th className="text-center py-3 px-4 font-medium text-apple-gray">Status</th>
                          <th className="text-center py-3 px-4 font-medium text-apple-gray">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.map((order) => (
                          <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4 px-4">
                              <div>
                                <p className="font-medium text-apple-gray">{order.customerName}</p>
                                <p className="text-sm text-gray-500">ID: {order.customerId}</p>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-gray-600">{order.product}</td>
                            <td className="py-4 px-4 font-medium text-apple-gray">{order.quantity}</td>
                            <td className="py-4 px-4 text-right font-medium text-success-green">
                              {formatCurrency(order.value)}
                            </td>
                            <td className="py-4 px-4 text-gray-600">
                              {new Date(order.date).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-4 text-center">
                              <Badge className={getOrderStatusColor(order.status)}>
                                {order.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </Badge>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <Button variant="ghost" size="sm">
                                View Details
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="communications">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white elevated-shadow border-0">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-apple-gray mb-4 flex items-center">
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Recent Messages
                    </h2>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-apple-gray">Kigali Cooperative Society</h3>
                          <span className="text-xs text-gray-500">2h ago</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          "Thank you for the excellent coffee beans. Our members are very satisfied with the quality."
                        </p>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-apple-gray">Green Valley Exports</h3>
                          <span className="text-xs text-gray-500">1d ago</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          "Can you increase the next order to 1500kg? We have high demand from our international clients."
                        </p>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-apple-gray">Local Market - Kimisagara</h3>
                          <span className="text-xs text-gray-500">3d ago</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          "The vegetables arrived fresh and on time. Looking forward to our next delivery."
                        </p>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full mt-4">
                      View All Messages
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="bg-white elevated-shadow border-0">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-apple-gray mb-4 flex items-center">
                      <Calendar className="mr-2 h-5 w-5" />
                      Upcoming Follow-ups
                    </h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                        <div className="w-3 h-3 bg-apple-blue rounded-full mr-4"></div>
                        <div className="flex-1">
                          <h3 className="font-medium text-apple-gray">Call Green Valley Exports</h3>
                          <p className="text-sm text-gray-600">Discuss contract renewal for Q4</p>
                          <p className="text-xs text-gray-500 mt-1">Tomorrow, 2:00 PM</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-4 bg-orange-50 rounded-lg">
                        <div className="w-3 h-3 bg-apple-orange rounded-full mr-4"></div>
                        <div className="flex-1">
                          <h3 className="font-medium text-apple-gray">Visit Kigali Cooperative</h3>
                          <p className="text-sm text-gray-600">Quality inspection and feedback session</p>
                          <p className="text-xs text-gray-500 mt-1">July 25, 10:00 AM</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-4 bg-green-50 rounded-lg">
                        <div className="w-3 h-3 bg-success-green rounded-full mr-4"></div>
                        <div className="flex-1">
                          <h3 className="font-medium text-apple-gray">Send pricing update</h3>
                          <p className="text-sm text-gray-600">New season pricing for all customers</p>
                          <p className="text-xs text-gray-500 mt-1">July 30, 9:00 AM</p>
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full mt-4">
                      Add Follow-up
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}