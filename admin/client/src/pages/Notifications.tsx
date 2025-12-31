import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Send, Clock } from "lucide-react";
import { toast } from "sonner";

export default function Notifications() {
  const [page, setPage] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "broadcast" as const,
    targetAudience: "all_users" as const,
  });

  const limit = 10;

  const { data: notificationsData, isLoading, refetch } = trpc.notifications.list.useQuery({
    limit,
    offset: page * limit,
  });

  const sendMutation = trpc.notifications.send.useMutation({
    onSuccess: () => {
      toast.success("Notification sent successfully");
      setFormData({
        title: "",
        content: "",
        type: "broadcast",
        targetAudience: "all_users",
      });
      setIsDialogOpen(false);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send notification");
    },
  });

  const handleSend = () => {
    if (!formData.title.trim()) {
      toast.error("Notification title is required");
      return;
    }
    if (!formData.content.trim()) {
      toast.error("Notification content is required");
      return;
    }

    sendMutation.mutate(formData);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setFormData({
      title: "",
      content: "",
      type: "broadcast",
      targetAudience: "all_users",
    });
  };

  const totalPages = notificationsData ? Math.ceil(notificationsData.total / limit) : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Broadcast Notifications</h1>
            <p className="text-gray-600 mt-2">Send notifications to users, restaurants, or riders</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Send className="h-4 w-4" />
                Send Notification
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Send Broadcast Notification</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <Input
                    placeholder="Notification title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content *
                  </label>
                  <Textarea
                    placeholder="Notification message"
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          type: value as any,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="broadcast">Broadcast</SelectItem>
                        <SelectItem value="alert">Alert</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                        <SelectItem value="order_update">Order Update</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target Audience
                    </label>
                    <Select
                      value={formData.targetAudience}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          targetAudience: value as any,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all_users">All Users</SelectItem>
                        <SelectItem value="customers">Customers</SelectItem>
                        <SelectItem value="restaurants">Restaurants</SelectItem>
                        <SelectItem value="riders">Riders</SelectItem>
                        <SelectItem value="admins">Admins</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-4">
                  <Button
                    variant="outline"
                    onClick={handleCloseDialog}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSend}
                    disabled={sendMutation.isPending}
                    className="gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Send
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Notification History</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading notifications...</p>
              </div>
            ) : !notificationsData?.notifications || notificationsData.notifications.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No notifications sent yet</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {notificationsData.notifications.map((notification: any) => (
                    <div
                      key={notification.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {notification.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.content}
                          </p>
                        </div>
                        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ml-2 ${getStatusColor(notification.status)}`}>
                          {notification.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-3">
                        <span>
                          Type: <span className="font-medium text-gray-700">{notification.type}</span>
                        </span>
                        <span>
                          Audience: <span className="font-medium text-gray-700">{notification.targetAudience.replace(/_/g, " ")}</span>
                        </span>
                        {notification.sentAt && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(notification.sentAt).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-gray-600">
                    Showing {page * limit + 1} to {Math.min((page + 1) * limit, notificationsData.total)} of {notificationsData.total} notifications
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
