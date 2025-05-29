import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import MainLayout from "./components/MainLayout";

// Components
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Receipts from "./components/Receipts";
import IngredientMaster from "./components/IngredientMaster";
import ActivityLog from "./components/ActivityLog";
import Agents from "./components/Agents";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          {/* Public route without sidebar */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes with sidebar */}
          <Route path="/" element={<MainLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="receipts" element={<Receipts />} />
            <Route path="ingredients" element={<IngredientMaster />} />
            <Route path="activity-log" element={<ActivityLog />} />
            <Route path="agents" element={<Agents />} />
          </Route>

          {/* Redirect root to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
