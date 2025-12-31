import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Search, CheckCircle, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";

export default function Restaurants() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const limit = 10;

  const { data: restaurantsData, isLoading, refetch } = trpc.restaurants.list.useQuery({
    limit,
    offset: page * limit,
    search: search || undefined,
  });

  const updateStatusMutation = trpc.restaurants.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Restaurant status updated successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update restaurant");
    },
  });

  const handleApprove = (restaurantId: number) => {
    updateStatusMutation.mutate({
      id: restaurantId,
      status: "approved",
      isActive: true,
    });
  };

  const handleReject = (restaurantId: number) => {
    updateStatusMutation.mutate({
      id: restaurantId,
      status: "rejected",
    });
  };

  const handleToggleStatus = (restaurantId: number, currentStatus: boolean) => {
    updateStatusMutation.mutate({
      id: restaurantId,
      status: currentStatus ? "inactive" : "active",
      isActive: !currentStatus,
    });
  };

  const totalPages = restaurantsData ? Math.ceil(restaurantsData.total / limit) : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Restaurants Management</h1>
          <p className="text-gray-600 mt-2">Manage restaurant registrations and status</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Search Restaurants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, or city..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(0);
                  }}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Restaurants List</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading restaurants...</p>
              </div>
            ) : !restaurantsData?.restaurants || restaurantsData.restaurants.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No restaurants found</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">City</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Rating</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {restaurantsData.restaurants.map((restaurant: any) => (
                        <tr key={restaurant.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{restaurant.name}</td>
                          <td className="py-3 px-4">{restaurant.email}</td>
                          <td className="py-3 px-4">{restaurant.city}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                              restaurant.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : restaurant.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {restaurant.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-500">★</span>
                              {restaurant.rating || "0"}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              {restaurant.status === "pending" && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="default"
                                    onClick={() => handleApprove(restaurant.id)}
                                    disabled={updateStatusMutation.isPending}
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleReject(restaurant.id)}
                                    disabled={updateStatusMutation.isPending}
                                  >
                                    Reject
                                  </Button>
                                </>
                              )}
                              {restaurant.status === "approved" && (
                                <Button
                                  size="sm"
                                  variant={restaurant.isActive ? "destructive" : "default"}
                                  onClick={() => handleToggleStatus(restaurant.id, restaurant.isActive)}
                                  disabled={updateStatusMutation.isPending}
                                >
                                  {restaurant.isActive ? "Disable" : "Enable"}
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
                    Showing {page * limit + 1} to {Math.min((page + 1) * limit, restaurantsData.total)} of {restaurantsData.total} restaurants
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
