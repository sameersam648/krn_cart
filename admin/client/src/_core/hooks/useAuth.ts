// Simplified useAuth hook - authentication removed for development
// You can add your own authentication later

type MockUser = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
};

const mockAdminUser: MockUser = {
  id: "admin-1",
  name: "Admin User",
  email: "admin@example.com",
  role: "admin",
};

type UseAuthReturn = {
  user: MockUser | null;
  loading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  refresh: () => void;
  logout: () => void;
};

export function useAuth(): UseAuthReturn {
  // Always return authenticated admin user for development
  return {
    user: mockAdminUser,
    loading: false,
    error: null,
    isAuthenticated: true,
    refresh: () => { },
    logout: () => {
      console.log("Logout clicked - implement your own logout logic here");
    },
  };
}
