import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import Layout from "../components/common/Layout";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import Projects from "../pages/Projects";
import ProjectDetail from "../pages/ProjectDetail";
import MyTasks from "../pages/MyTasks";
import Loader from "../components/common/Loader";
const AppRouter = () => {
  const { loading } = useAuth();

  if (loading) return <Loader fullScreen />;

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/my-tasks" element={<MyTasks />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRouter;
