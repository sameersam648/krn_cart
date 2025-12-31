import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Restaurants from "./pages/Restaurants";
import Riders from "./pages/Riders";
import Orders from "./pages/Orders";
import Categories from "./pages/Categories";
import MenuItems from "./pages/MenuItems";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/users"} component={Users} />
      <Route path={"/restaurants"} component={Restaurants} />
      <Route path={"/riders"} component={Riders} />
      <Route path={"/orders"} component={Orders} />
      <Route path={"/categories"} component={Categories} />
      <Route path={"/menu-items"} component={MenuItems} />
      <Route path={"/settings"} component={Settings} />
      <Route path={"/notifications"} component={Notifications} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
