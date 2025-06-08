import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/layout/MainLayout";

interface AuthRedirectProps {
  children: React.ReactNode;
}

const AuthRedirect = ({ children }: AuthRedirectProps) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Handle redirect for authenticated users
  useEffect(() => {
    if (!loading && user) {
      const userRole = profile?.role || user?.role;
      const targetPath =
        userRole === "company" ? "/company-dashboard" : "/dashboard";
      if (location.pathname === "/login" || location.pathname === "/sign-up") {
        navigate(targetPath, { replace: true });
      }
    }
  }, [user, profile, loading, location.pathname, navigate]);

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

  // If user is authenticated, we let useEffect handle the redirect
  // and render children temporarily to avoid flash
  if (user) {
    return <>{children}</>;
  }

  // If not authenticated, show the login/signup page
  return <>{children}</>;
};

export default AuthRedirect;
