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
import { Search, CheckCircle, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";

export default function MenuItems() {
  const [restaurantId, setRestaurantId] = useState<string>("");
  const [page, setPage] = useState(0);
  const limit = 10;

  const { data: menuItemsData, isLoading, refetch } = restaurantId
    ? trpc.menuItems.getRestaurantMenu.useQuery({
        restaurantId: parseInt(restaurantId),
        limit,
        offset: page * limit,
      })
    : { data: undefined, isLoading: false, refetch: () => {} };

  const updateStatusMutation = trpc.menuItems.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Menu item status updated successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update menu item");
    },
  });

  const handleApprove = (itemId: number) => {
    updateStatusMutation.mutate({
      id: itemId,
      status: "approved",
      isActive: true,
    });
  };

  const handleReject = (itemId: number) => {
    updateStatusMutation.mutate({
      id: itemId,
      status: "rejected",
    });
  };

  const handleToggleStatus = (itemId: number, currentStatus: boolean) => {
    updateStatusMutation.mutate({
      id: itemId,
      status: "approved",
      isActive: !currentStatus,
    });
  };

  const totalPages = menuItemsData ? Math.ceil(menuItemsData.total / limit) : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Menu Items Management</h1>
          <p className="text-gray-600 mt-2">Approve and manage restaurant menu items</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select Restaurant</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Enter restaurant ID"
                value={restaurantId}
                onChange={(e) => {
                  setRestaurantId(e.target.value);
                  setPage(0);
                }}
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={() => {
                  if (restaurantId) {
                    refetch();
                  }
                }}
              >
                Load Menu
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Enter a restaurant ID to view and manage their menu items
            </p>
          </CardContent>
        </Card>

        {restaurantId && (
          <Card>
            <CardHeader>
              <CardTitle>Menu Items List</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading menu items...</p>
                </div>
              ) : !menuItemsData?.items || menuItemsData.items.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No menu items found</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Price</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Active</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {menuItemsData.items.map((item: any) => (
                          <tr key={item.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium">{item.name}</td>
                            <td className="py-3 px-4">₹{parseFloat(item.price).toFixed(2)}</td>
                            <td className="py-3 px-4">
                              <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                                item.status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : item.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}>
                                {item.status}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              {item.isActive ? (
                                <span className="inline-flex items-center gap-1 text-green-700">
                                  <CheckCircle className="h-4 w-4" />
                                  Active
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-red-700">
                                  <XCircle className="h-4 w-4" />
                                  Inactive
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                {item.status === "pending" && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="default"
                                      onClick={() => handleApprove(item.id)}
                                      disabled={updateStatusMutation.isPending}
                                    >
                                      Approve
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => handleReject(item.id)}
                                      disabled={updateStatusMutation.isPending}
                                    >
                                      Reject
                                    </Button>
                                  </>
                                )}
                                {item.status === "approved" && (
                                  <Button
                                    size="sm"
                                    variant={item.isActive ? "destructive" : "default"}
                                    onClick={() => handleToggleStatus(item.id, item.isActive)}
                                    disabled={updateStatusMutation.isPending}
                                  >
                                    {item.isActive ? "Disable" : "Enable"}
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
                      Showing {page * limit + 1} to {Math.min((page + 1) * limit, menuItemsData.total)} of {menuItemsData.total} items
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
        )}
      </div>
    </DashboardLayout>
  );
}
