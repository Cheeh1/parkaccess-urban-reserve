import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/layout/MainLayout";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  requiredRole?: "user" | "company" | "admin";
}

const ProtectedRoute = ({
  children,
  requireAuth = true,
  redirectTo = "/login",
  requiredRole,
}: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-parking-primary"></div>
        </div>
      </MainLayout>
    );
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If specific role is required, check the user's role
  if (
    requiredRole &&
    profile?.role !== requiredRole &&
    user?.role !== requiredRole
  ) {
    // Redirect based on user's actual role
    const userRole = profile?.role || user?.role;
    if (userRole === "company") {
      return <Navigate to="/company-dashboard" replace />;
    } else if (userRole === "user") {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
