import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/common/Loader";
const ProtectedRoute = () => {
  const { user, loading } = useAuth();
if (loading) {
  return <Loader fullScreen />;
}  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
