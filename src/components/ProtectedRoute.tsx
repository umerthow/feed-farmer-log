import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/MainLayout';
import Dashboard from '@/components/Dashboard';
import Receipts from '@/components/Receipts';
import IngredientMaster from '@/components/IngredientMaster';
import ActivityLog from '@/components/ActivityLog';
import Agents from '@/components/Agents';
import Login from '@/components/Login';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    {/* Protected routes */}
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }
    >
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="receipts" element={<Receipts />} />
      <Route path="ingredients" element={<IngredientMaster />} />
      <Route path="activity-log" element={<ActivityLog />} />
      <Route path="agents" element={<Agents />} />
    </Route>

    {/* Public route */}
    <Route path="/login" element={<Login />} />
  </Routes>
);

export default AppRoutes;