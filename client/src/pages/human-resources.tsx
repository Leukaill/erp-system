import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserPlus, Clock, Calendar, Award, DollarSign, Phone, Mail, MapPin } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

export default function HumanResources() {
  const [searchQuery, setSearchQuery] = useState("");

  // Sample data for demonstration
  const employees = [
    {
      id: 1,
      name: "Jean Baptiste Uwimana",
      position: "Farm Manager",
      department: "Operations",
      phone: "+250 788 123 456",
      email: "jean.uwimana@agriflow.rw",
      location: "Musanze Sector",
      salary: 450000,
      startDate: "2023-01-15",
      status: "active",
      performance: "excellent",
      tasksCompleted: 24,
      attendance: 98,
    },
    {
      id: 2,
      name: "Marie Claire Mukamana",
      position: "Agricultural Specialist",
      department: "Technical",
      phone: "+250 788 654 321",
      email: "marie.mukamana@agriflow.rw",
      location: "Nyagatare Sector",
      salary: 380000,
      startDate: "2023-03-20",
      status: "active",
      performance: "good",
      tasksCompleted: 19,
      attendance: 95,
    },
    {
      id: 3,
      name: "David Niyonsenga",
      position: "Equipment Operator",
      department: "Operations",
      phone: "+250 788 987 654",
      email: "david.niyonsenga@agriflow.rw",
      location: "Kicukiro Sector",
      salary: 320000,
      startDate: "2022-11-10",
      status: "active",
      performance: "good",
      tasksCompleted: 31,
      attendance: 92,
    },
    {
      id: 4,
      name: "Grace Uwizera",
      position: "Quality Inspector",
      department: "Quality Control",
      phone: "+250 788 456 789",
      email: "grace.uwizera@agriflow.rw",
      location: "Musanze Sector",
      salary: 350000,
      startDate: "2023-05-01",
      status: "active",
      performance: "excellent",
      tasksCompleted: 16,
      attendance: 99,
    },
  ];

  const attendanceRecords = [
    { id: 1, employeeId: 1, date: "2024-07-20", status: "present", hoursWorked: 8 },
    { id: 2, employeeId: 2, date: "2024-07-20", status: "present", hoursWorked: 8 },
    { id: 3, employeeId: 3, date: "2024-07-20", status: "late", hoursWorked: 7.5 },
    { id: 4, employeeId: 4, date: "2024-07-20", status: "present", hoursWorked: 8 },
  ];

  const payrollData = [
    { month: "July 2024", totalSalaries: 1500000, employeesCount: 4, bonuses: 200000, deductions: 150000 },
    { month: "June 2024", totalSalaries: 1500000, employeesCount: 4, bonuses: 150000, deductions: 120000 },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('rw-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent':
        return 'bg-success-green bg-opacity-10 text-success-green';
      case 'good':
        return 'bg-apple-blue bg-opacity-10 text-apple-blue';
      case 'average':
        return 'bg-apple-orange bg-opacity-10 text-apple-orange';
      case 'poor':
        return 'bg-apple-red bg-opacity-10 text-apple-red';
      default:
        return 'bg-gray-500 bg-opacity-10 text-gray-500';
    }
  };

  const getAttendanceColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-success-green bg-opacity-10 text-success-green';
      case 'late':
        return 'bg-apple-orange bg-opacity-10 text-apple-orange';
      case 'absent':
        return 'bg-apple-red bg-opacity-10 text-apple-red';
      default:
        return 'bg-gray-500 bg-opacity-10 text-gray-500';
    }
  };

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchQuery.toLowerCase())
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
                <h1 className="text-3xl font-semibold text-apple-gray mb-2">Human Resources</h1>
                <p className="text-gray-600">Manage employees, attendance, and payroll</p>
              </div>
              
              <Button className="bg-apple-blue hover:bg-blue-600">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Employee
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white elevated-shadow border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Employees</p>
                    <p className="text-2xl font-semibold text-apple-gray">{employees.length}</p>
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
                    <p className="text-sm text-gray-600 mb-1">Present Today</p>
                    <p className="text-2xl font-semibold text-apple-gray">
                      {attendanceRecords.filter(record => record.status === 'present').length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-success-green bg-opacity-10 rounded-xl flex items-center justify-center">
                    <Clock className="text-success-green" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white elevated-shadow border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Monthly Payroll</p>
                    <p className="text-2xl font-semibold text-apple-gray">
                      {formatCurrency(payrollData[0].totalSalaries)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-apple-orange bg-opacity-10 rounded-xl flex items-center justify-center">
                    <DollarSign className="text-apple-orange" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white elevated-shadow border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Avg. Attendance</p>
                    <p className="text-2xl font-semibold text-apple-gray">
                      {Math.round(employees.reduce((sum, emp) => sum + emp.attendance, 0) / employees.length)}%
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-success-green bg-opacity-10 rounded-xl flex items-center justify-center">
                    <Award className="text-success-green" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="employees" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="employees">Employees ({employees.length})</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="payroll">Payroll</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="employees">
              {/* Search */}
              <Card className="bg-white elevated-shadow border-0 mb-6">
                <CardContent className="p-4">
                  <Input
                    placeholder="Search employees by name, position, or department..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </CardContent>
              </Card>

              {/* Employee Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEmployees.map((employee) => (
                  <Card key={employee.id} className="bg-white elevated-shadow border-0 hover:shadow-lg transition-shadow duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-apple-blue bg-opacity-10 rounded-full flex items-center justify-center">
                          <Users className="text-apple-blue" />
                        </div>
                        <Badge className={getPerformanceColor(employee.performance)}>
                          {employee.performance.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Badge>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-apple-gray mb-1">{employee.name}</h3>
                      <p className="text-sm text-gray-600 mb-1">{employee.position}</p>
                      <p className="text-xs text-gray-500 mb-4">{employee.department}</p>
                      
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2" />
                          {employee.phone}
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2" />
                          {employee.email}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          {employee.location}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500">Monthly Salary</p>
                          <p className="text-sm font-semibold text-success-green">
                            {formatCurrency(employee.salary)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Attendance</p>
                          <p className="text-sm font-semibold text-apple-blue">{employee.attendance}%</p>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-500 mb-4">
                        Started: {new Date(employee.startDate).toLocaleDateString()}
                      </p>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          Edit
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
            
            <TabsContent value="attendance">
              <Card className="bg-white elevated-shadow border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-apple-gray">Today's Attendance</h2>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        View Calendar
                      </Button>
                      <Button size="sm" className="bg-success-green hover:bg-green-600">
                        Mark Attendance
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {employees.map((employee) => {
                      const attendance = attendanceRecords.find(record => record.employeeId === employee.id);
                      return (
                        <Card key={employee.id} className={`border ${
                          attendance?.status === 'present' ? 'border-success-green' :
                          attendance?.status === 'late' ? 'border-apple-orange' :
                          'border-apple-red'
                        }`}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-medium text-apple-gray text-sm">{employee.name}</h3>
                              <Badge className={getAttendanceColor(attendance?.status || 'absent')}>
                                {attendance?.status || 'Absent'}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-500 mb-2">{employee.position}</p>
                            {attendance && (
                              <p className="text-xs text-gray-600">Hours: {attendance.hoursWorked}</p>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-success-green bg-opacity-10 rounded-lg">
                      <p className="text-2xl font-bold text-success-green">
                        {attendanceRecords.filter(r => r.status === 'present').length}
                      </p>
                      <p className="text-sm text-gray-600">Present</p>
                    </div>
                    <div className="text-center p-4 bg-apple-orange bg-opacity-10 rounded-lg">
                      <p className="text-2xl font-bold text-apple-orange">
                        {attendanceRecords.filter(r => r.status === 'late').length}
                      </p>
                      <p className="text-sm text-gray-600">Late</p>
                    </div>
                    <div className="text-center p-4 bg-apple-red bg-opacity-10 rounded-lg">
                      <p className="text-2xl font-bold text-apple-red">
                        {employees.length - attendanceRecords.length}
                      </p>
                      <p className="text-sm text-gray-600">Absent</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="payroll">
              <div className="space-y-6">
                <Card className="bg-white elevated-shadow border-0">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-apple-gray mb-6">Monthly Payroll Summary</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                      <div className="text-center p-4 bg-apple-blue bg-opacity-10 rounded-lg">
                        <p className="text-2xl font-bold text-apple-blue">
                          {formatCurrency(payrollData[0].totalSalaries)}
                        </p>
                        <p className="text-sm text-gray-600">Total Salaries</p>
                      </div>
                      <div className="text-center p-4 bg-success-green bg-opacity-10 rounded-lg">
                        <p className="text-2xl font-bold text-success-green">
                          {formatCurrency(payrollData[0].bonuses)}
                        </p>
                        <p className="text-sm text-gray-600">Bonuses</p>
                      </div>
                      <div className="text-center p-4 bg-apple-red bg-opacity-10 rounded-lg">
                        <p className="text-2xl font-bold text-apple-red">
                          {formatCurrency(payrollData[0].deductions)}
                        </p>
                        <p className="text-sm text-gray-600">Deductions</p>
                      </div>
                      <div className="text-center p-4 bg-apple-orange bg-opacity-10 rounded-lg">
                        <p className="text-2xl font-bold text-apple-orange">
                          {formatCurrency(payrollData[0].totalSalaries + payrollData[0].bonuses - payrollData[0].deductions)}
                        </p>
                        <p className="text-sm text-gray-600">Net Payroll</p>
                      </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-medium text-apple-gray">Employee</th>
                            <th className="text-left py-3 px-4 font-medium text-apple-gray">Position</th>
                            <th className="text-right py-3 px-4 font-medium text-apple-gray">Base Salary</th>
                            <th className="text-right py-3 px-4 font-medium text-apple-gray">Attendance %</th>
                            <th className="text-right py-3 px-4 font-medium text-apple-gray">Net Pay</th>
                            <th className="text-center py-3 px-4 font-medium text-apple-gray">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {employees.map((employee) => (
                            <tr key={employee.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-4 px-4">
                                <div>
                                  <p className="font-medium text-apple-gray">{employee.name}</p>
                                  <p className="text-sm text-gray-500">{employee.email}</p>
                                </div>
                              </td>
                              <td className="py-4 px-4 text-gray-600">{employee.position}</td>
                              <td className="py-4 px-4 text-right font-medium text-apple-blue">
                                {formatCurrency(employee.salary)}
                              </td>
                              <td className="py-4 px-4 text-right font-medium text-gray-600">
                                {employee.attendance}%
                              </td>
                              <td className="py-4 px-4 text-right font-medium text-success-green">
                                {formatCurrency(Math.round(employee.salary * (employee.attendance / 100)))}
                              </td>
                              <td className="py-4 px-4 text-center">
                                <Badge className="bg-success-green bg-opacity-10 text-success-green">
                                  Paid
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="performance">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {employees.map((employee) => (
                  <Card key={employee.id} className="bg-white elevated-shadow border-0">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-apple-gray">{employee.name}</h3>
                          <p className="text-sm text-gray-600">{employee.position}</p>
                        </div>
                        <Badge className={getPerformanceColor(employee.performance)}>
                          {employee.performance.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Tasks Completed</p>
                          <p className="text-2xl font-semibold text-apple-blue">{employee.tasksCompleted}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Attendance Rate</p>
                          <p className="text-2xl font-semibold text-success-green">{employee.attendance}%</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Performance Score</span>
                          <span className="font-medium">
                            {employee.performance === 'excellent' ? '95%' :
                             employee.performance === 'good' ? '80%' :
                             employee.performance === 'average' ? '65%' : '50%'}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              employee.performance === 'excellent' ? 'bg-success-green' :
                              employee.performance === 'good' ? 'bg-apple-blue' :
                              employee.performance === 'average' ? 'bg-apple-orange' : 'bg-apple-red'
                            }`}
                            style={{
                              width: employee.performance === 'excellent' ? '95%' :
                                     employee.performance === 'good' ? '80%' :
                                     employee.performance === 'average' ? '65%' : '50%'
                            }}
                          />
                        </div>
                      </div>
                      
                      <Button variant="outline" className="w-full">
                        View Full Review
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}