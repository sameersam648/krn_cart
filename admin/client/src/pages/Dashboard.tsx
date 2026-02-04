import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Users, Store, Bike, ShoppingCart, TrendingUp, Clock } from "lucide-react";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = trpc.dashboard.getStats.useQuery();
  const { data: revenueData, isLoading: revenueLoading } = trpc.dashboard.getRevenueStats.useQuery({ days: 30 });

  const processRevenueData = () => {
    if (!revenueData) return [];

    const dailyRevenue: Record<string, number> = {};
    revenueData.forEach((item: any) => {
      const date = new Date(item.date).toLocaleDateString();
      dailyRevenue[date] = (dailyRevenue[date] || 0) + parseFloat(item.total);
    });

    return Object.entries(dailyRevenue).map(([date, total]) => ({
      date,
      revenue: total,
    }));
  };

  const statCards = [
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Active Orders",
      value: stats?.activeOrders || 0,
      icon: Clock,
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Restaurants",
      value: stats?.totalRestaurants || 0,
      icon: Store,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Riders",
      value: stats?.totalRiders || 0,
      icon: Bike,
      color: "bg-pink-100 text-pink-600",
    },
    {
      title: "Today's Orders",
      value: stats?.todayOrders || 0,
      icon: TrendingUp,
      color: "bg-indigo-100 text-indigo-600",
    },
  ];

  const orderStatusData = stats ? [
    { name: "Active", value: stats.activeOrders },
    { name: "Completed", value: Math.max(0, stats.totalOrders - stats.activeOrders) },
  ] : [];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome to your KNR Cart admin panel</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {statsLoading ? "..." : stat.value}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Revenue Trend (Last 30 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              {revenueLoading ? (
                <div className="h-80 flex items-center justify-center text-gray-500">
                  Loading chart...
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={processRevenueData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: "#3b82f6", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Order Status Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="h-80 flex items-center justify-center text-gray-500">
                  Loading...
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {orderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">
                  {statsLoading ? "..." : stats?.totalOrders}
                </p>
                <p className="text-sm text-gray-600 mt-1">Total Orders</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  {statsLoading ? "..." : stats?.totalUsers}
                </p>
                <p className="text-sm text-gray-600 mt-1">Total Users</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">
                  {statsLoading ? "..." : stats?.totalRestaurants}
                </p>
                <p className="text-sm text-gray-600 mt-1">Restaurants</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-pink-600">
                  {statsLoading ? "..." : stats?.totalRiders}
                </p>
                <p className="text-sm text-gray-600 mt-1">Riders</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
