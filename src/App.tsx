import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AuthRedirect from "@/components/auth/AuthRedirect";
import Index from "./pages/Index";
import ParkingLots from "./pages/ParkingLots";
import Booking from "./pages/Booking";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            <AuthProvider>
              <Toaster />
              <Sonner />
              <Routes>
                {/* Public routes - accessible to everyone */}
                <Route path="/" element={<Index />} />
                <Route path="/parking-lots" element={<ParkingLots />} />

                {/* Auth routes - redirect if already authenticated */}
                <Route
                  path="/login"
                  element={
                    <AuthRedirect>
                      <Login />
                    </AuthRedirect>
                  }
                />
                <Route
                  path="/sign-up"
                  element={
                    <AuthRedirect>
                      <SignUp />
                    </AuthRedirect>
                  }
                />

                {/* Protected routes - require authentication */}
                <Route
                  path="/book/:id"
                  element={
                    <ProtectedRoute>
                      <Booking />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout/:id"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />

                {/* User dashboard - only for regular users */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute requiredRole="user">
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Company dashboard - only for company users */}
                <Route
                  path="/company-dashboard"
                  element={
                    <ProtectedRoute requiredRole="company">
                      <CompanyDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
