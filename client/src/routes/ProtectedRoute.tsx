// components/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import Loader from '../ui/Loader';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  
  if (loading) return <Loader />;

  if (!user) return <Navigate to="/login" />;

  // Example: user-only
  if (user.role !== 'user') return <Navigate to="/unauthorized" />;

  return <Outlet />;
};


export default ProtectedRoute;
