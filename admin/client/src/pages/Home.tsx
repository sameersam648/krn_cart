import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Home() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      navigate("/dashboard");
    }
  }, [isAuthenticated, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Food Delivery Admin Panel
            </h1>
            <p className="text-gray-600">
              Manage your entire food delivery platform from one place
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-6 w-6 rounded-md bg-indigo-500 text-white">
                  ✓
                </div>
              </div>
              <p className="text-sm text-gray-700">
                Manage users, restaurants, and riders
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-6 w-6 rounded-md bg-indigo-500 text-white">
                  ✓
                </div>
              </div>
              <p className="text-sm text-gray-700">
                Monitor orders and delivery status
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-6 w-6 rounded-md bg-indigo-500 text-white">
                  ✓
                </div>
              </div>
              <p className="text-sm text-gray-700">
                View analytics and revenue reports
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-6 w-6 rounded-md bg-indigo-500 text-white">
                  ✓
                </div>
              </div>
              <p className="text-sm text-gray-700">
                Send broadcast notifications
              </p>
            </div>
          </div>

          <a href={getLoginUrl()}>
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
              Sign in with Manus
            </Button>
          </a>
        </div>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You do not have admin access to this panel. Please contact your administrator.
          </p>
          <a href={getLoginUrl()}>
            <Button variant="outline" className="w-full">
              Sign in with Different Account
            </Button>
          </a>
        </div>
      </div>
    );
  }

  return null;
}
