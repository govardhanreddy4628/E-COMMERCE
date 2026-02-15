// components/GuestRoute.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext';



const GuestRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  // If already authenticated, redirect to previous page (or default to /dashboard)
  if (user) {
    const from = location.state?.from?.pathname || "/dashboard";
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
};

export default GuestRoute;
