import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Search, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function Riders() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const limit = 10;

  const { data: ridersData, isLoading, refetch } = trpc.riders.list.useQuery({
    limit,
    offset: page * limit,
    search: search || undefined,
  });

  const updateStatusMutation = trpc.riders.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Rider status updated successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update rider");
    },
  });

  const handleApprove = (riderId: number) => {
    updateStatusMutation.mutate({
      id: riderId,
      status: "approved",
      isActive: true,
    });
  };

  const handleReject = (riderId: number) => {
    updateStatusMutation.mutate({
      id: riderId,
      status: "rejected",
    });
  };

  const handleBlock = (riderId: number) => {
    updateStatusMutation.mutate({
      id: riderId,
      status: "blocked",
      isActive: false,
    });
  };

  const handleToggleStatus = (riderId: number, currentStatus: boolean) => {
    updateStatusMutation.mutate({
      id: riderId,
      status: currentStatus ? "inactive" : "active",
      isActive: !currentStatus,
    });
  };

  const totalPages = ridersData ? Math.ceil(ridersData.total / limit) : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Riders Management</h1>
          <p className="text-gray-600 mt-2">Manage delivery riders and their status</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Search Riders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, or phone..."
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
            <CardTitle>Riders List</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading riders...</p>
              </div>
            ) : !ridersData?.riders || ridersData.riders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No riders found</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Phone</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Vehicle</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Rating</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ridersData.riders.map((rider: any) => (
                        <tr key={rider.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{rider.name}</td>
                          <td className="py-3 px-4">{rider.email}</td>
                          <td className="py-3 px-4">{rider.phone}</td>
                          <td className="py-3 px-4">
                            <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              {rider.vehicleType}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                              rider.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : rider.status === "blocked"
                                ? "bg-red-100 text-red-800"
                                : rider.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {rider.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-500">★</span>
                              {rider.rating || "0"}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              {rider.status === "pending" && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="default"
                                    onClick={() => handleApprove(rider.id)}
                                    disabled={updateStatusMutation.isPending}
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleReject(rider.id)}
                                    disabled={updateStatusMutation.isPending}
                                  >
                                    Reject
                                  </Button>
                                </>
                              )}
                              {rider.status === "approved" && (
                                <>
                                  <Button
                                    size="sm"
                                    variant={rider.isActive ? "destructive" : "default"}
                                    onClick={() => handleToggleStatus(rider.id, rider.isActive)}
                                    disabled={updateStatusMutation.isPending}
                                  >
                                    {rider.isActive ? "Disable" : "Enable"}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleBlock(rider.id)}
                                    disabled={updateStatusMutation.isPending}
                                  >
                                    Block
                                  </Button>
                                </>
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
                    Showing {page * limit + 1} to {Math.min((page + 1) * limit, ridersData.total)} of {ridersData.total} riders
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
