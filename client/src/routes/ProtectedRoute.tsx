// // components/ProtectedRoute.tsx
// import { Navigate, Outlet } from 'react-router-dom';
// import Loader from '../ui/Loader';
// import { useAuth } from '../hooks/useAuth';

// const ProtectedRoute = () => {
//   const { user, loading } = useAuth();
  
//   if (loading) return <Loader />;

//   if (!user) return <Navigate to="/login" />;

//   // Example: user-only
//   if (user.role !== 'user') return <Navigate to="/unauthorized" />;

//   return <Outlet />;
// };


// export default ProtectedRoute;



// routes/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isAuthLoading } = useAuth();

  if (isAuthLoading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
