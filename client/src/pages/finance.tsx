import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, TrendingUp, TrendingDown, DollarSign, FileText, Download } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  category: z.string().min(1, "Category is required"),
  amount: z.string().min(1, "Amount is required"),
  description: z.string().optional(),
  date: z.string().min(1, "Date is required"),
});

interface Transaction {
  id: number;
  type: string;
  category: string;
  amount: string;
  currency: string;
  description: string;
  date: string;
  status: string;
}

interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  profit: number;
  transactions: Transaction[];
}

export default function Finance() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "income",
      category: "",
      amount: "",
      description: "",
      date: new Date().toISOString().split('T')[0],
    },
  });

  const { data: summary, isLoading: summaryLoading } = useQuery<FinancialSummary>({
    queryKey: ["/api/financial/summary", { months: 12 }],
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const createTransactionMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/transactions", {
        ...data,
        amount: parseFloat(data.amount),
        currency: "RWF",
        date: new Date(data.date),
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Transaction recorded successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/financial/summary"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to record transaction",
        variant: "destructive",
      });
    },
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('rw-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const onSubmit = (data: any) => {
    createTransactionMutation.mutate(data);
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
                <h1 className="text-3xl font-semibold text-apple-gray mb-2">Financial Management</h1>
                <p className="text-gray-600">Track income, expenses, and financial performance</p>
              </div>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-apple-blue hover:bg-blue-600">
                    <Plus className="mr-2 h-4 w-4" />
                    Record Transaction
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Record New Transaction</DialogTitle>
                    <DialogDescription>Add a new income or expense record</DialogDescription>
                  </DialogHeader>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="income">Income</SelectItem>
                                <SelectItem value="expense">Expense</SelectItem>
                              </SelectContent>
                            </Select>
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
                                {form.watch("type") === "income" ? (
                                  <>
                                    <SelectItem value="sales">Sales</SelectItem>
                                    <SelectItem value="harvest">Harvest</SelectItem>
                                    <SelectItem value="other">Other Income</SelectItem>
                                  </>
                                ) : (
                                  <>
                                    <SelectItem value="seeds">Seeds</SelectItem>
                                    <SelectItem value="fertilizers">Fertilizers</SelectItem>
                                    <SelectItem value="equipment">Equipment</SelectItem>
                                    <SelectItem value="labor">Labor</SelectItem>
                                    <SelectItem value="maintenance">Maintenance</SelectItem>
                                    <SelectItem value="other">Other Expense</SelectItem>
                                  </>
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount (RWF)</FormLabel>
                            <FormControl>
                              <Input placeholder="0" type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description (Optional)</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Additional details..." {...field} />
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
                          disabled={createTransactionMutation.isPending}
                          className="bg-apple-blue hover:bg-blue-600"
                        >
                          {createTransactionMutation.isPending ? "Recording..." : "Record Transaction"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white elevated-shadow border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-success-green bg-opacity-10 rounded-xl flex items-center justify-center">
                    <TrendingUp className="text-success-green text-xl" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-apple-gray mb-1">
                  {summaryLoading ? "..." : formatCurrency(summary?.totalRevenue || 0)}
                </h3>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-xs text-gray-500 mt-2">Last 12 months</p>
              </CardContent>
            </Card>

            <Card className="bg-white elevated-shadow border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-apple-red bg-opacity-10 rounded-xl flex items-center justify-center">
                    <TrendingDown className="text-apple-red text-xl" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-apple-gray mb-1">
                  {summaryLoading ? "..." : formatCurrency(summary?.totalExpenses || 0)}
                </h3>
                <p className="text-sm text-gray-600">Total Expenses</p>
                <p className="text-xs text-gray-500 mt-2">Last 12 months</p>
              </CardContent>
            </Card>

            <Card className="bg-white elevated-shadow border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-apple-blue bg-opacity-10 rounded-xl flex items-center justify-center">
                    <DollarSign className="text-apple-blue text-xl" />
                  </div>
                </div>
                <h3 className={`text-2xl font-semibold mb-1 ${
                  (summary?.profit || 0) >= 0 ? 'text-success-green' : 'text-apple-red'
                }`}>
                  {summaryLoading ? "..." : formatCurrency(summary?.profit || 0)}
                </h3>
                <p className="text-sm text-gray-600">Net Profit</p>
                <p className="text-xs text-gray-500 mt-2">Revenue - Expenses</p>
              </CardContent>
            </Card>
          </div>

          {/* Transactions Table */}
          <Card className="bg-white elevated-shadow border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-apple-gray">Recent Transactions</h2>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-light-gray">
                      <th className="text-left py-3 px-4 font-medium text-apple-gray">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-apple-gray">Type</th>
                      <th className="text-left py-3 px-4 font-medium text-apple-gray">Category</th>
                      <th className="text-left py-3 px-4 font-medium text-apple-gray">Description</th>
                      <th className="text-right py-3 px-4 font-medium text-apple-gray">Amount</th>
                      <th className="text-center py-3 px-4 font-medium text-apple-gray">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactionsLoading ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-gray-500">Loading transactions...</td>
                      </tr>
                    ) : transactions && transactions.length > 0 ? (
                      transactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4 text-sm text-gray-600">
                            {format(new Date(transaction.date), 'MMM dd, yyyy')}
                          </td>
                          <td className="py-4 px-4">
                            <Badge 
                              variant={transaction.type === 'income' ? 'default' : 'secondary'}
                              className={`${
                                transaction.type === 'income' 
                                  ? 'bg-success-green bg-opacity-10 text-success-green' 
                                  : 'bg-apple-red bg-opacity-10 text-apple-red'
                              }`}
                            >
                              {transaction.type === 'income' ? 'Income' : 'Expense'}
                            </Badge>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-600 capitalize">
                            {transaction.category}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-600">
                            {transaction.description || '-'}
                          </td>
                          <td className={`py-4 px-4 text-sm text-right font-medium ${
                            transaction.type === 'income' ? 'text-success-green' : 'text-apple-red'
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'}{formatCurrency(parseFloat(transaction.amount))}
                          </td>
                          <td className="py-4 px-4 text-center">
                            <Badge 
                              variant="outline"
                              className="bg-apple-blue bg-opacity-10 text-apple-blue border-apple-blue"
                            >
                              {transaction.status}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-8">
                          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                          <p className="text-gray-500">No transactions recorded yet</p>
                          <p className="text-sm text-gray-400 mt-1">Start by recording your first transaction</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}