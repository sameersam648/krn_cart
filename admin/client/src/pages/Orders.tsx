import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Search, Eye } from "lucide-react";
import { toast } from "sonner";

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "picked_up",
  "in_transit",
  "delivered",
  "cancelled",
  "refunded",
];

export default function Orders() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0);
  const limit = 10;

  const { data: ordersData, isLoading, refetch } = trpc.orders.list.useQuery({
    limit,
    offset: page * limit,
    search: search || undefined,
    status: statusFilter || undefined,
  });

  const updateStatusMutation = trpc.orders.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Order status updated successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update order");
    },
  });

  const cancelOrderMutation = trpc.orders.cancel.useMutation({
    onSuccess: () => {
      toast.success("Order cancelled successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to cancel order");
    },
  });

  const handleUpdateStatus = (orderId: number, newStatus: string) => {
    updateStatusMutation.mutate({
      id: orderId,
      status: newStatus as any,
    });
  };

  const handleCancelOrder = (orderId: number) => {
    if (confirm("Are you sure you want to cancel this order?")) {
      cancelOrderMutation.mutate({
        id: orderId,
        reason: "Cancelled by admin",
      });
    }
  };

  const totalPages = ordersData ? Math.ceil(ordersData.total / limit) : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
      case "refunded":
        return "bg-red-100 text-red-800";
      case "in_transit":
      case "picked_up":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-gray-600 mt-2">Monitor and manage all platform orders</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Search & Filter Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              <div className="flex-1 min-w-64 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by order number..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(0);
                  }}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter || "all"} onValueChange={(value) => {
                setStatusFilter(value === "all" ? "" : value);
                setPage(0);
              }}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {ORDER_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders List</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading orders...</p>
              </div>
            ) : !ordersData?.orders || ordersData.orders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No orders found</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Order #</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Payment</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Created</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ordersData.orders.map((order: any) => (
                        <tr key={order.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{order.orderNumber}</td>
                          <td className="py-3 px-4">₹{parseFloat(order.totalAmount).toFixed(2)}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                              {order.status.replace("_", " ")}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${order.paymentStatus === "completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                              }`}>
                              {order.paymentStatus}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Select
                                value={order.status}
                                onValueChange={(newStatus) =>
                                  handleUpdateStatus(order.id, newStatus)
                                }
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {ORDER_STATUSES.map((status) => (
                                    <SelectItem key={status} value={status}>
                                      {status.replace("_", " ")}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {order.status !== "cancelled" && order.status !== "delivered" && (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleCancelOrder(order.id)}
                                  disabled={cancelOrderMutation.isPending}
                                >
                                  Cancel
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-gray-600">
                    Showing {page * limit + 1} to {Math.min((page + 1) * limit, ordersData.total)} of {ordersData.total} orders
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setPage(Math.max(0, page - 1))}
                      disabled={page === 0}
                    >
                      Previous
                    </Button>
                    <span className="flex items-center px-3 text-sm">
                      Page {page + 1} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                      disabled={page >= totalPages - 1}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
