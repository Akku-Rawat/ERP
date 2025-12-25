import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../routes/RoutesPath";

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Outlet /> : <Navigate to={ROUTES.LOGIN} replace />;
};

export default ProtectedRoute;
