import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Car, Menu, X, User, LogIn, LogOut, Building2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, profile, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const isLoggedIn = !!user && !loading;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const getDashboardLink = () => {
    const userRole = profile?.role || user?.role;
    if (userRole === "company") {
      return "/company-dashboard";
    }
    return "/dashboard";
  };

  const getDashboardLabel = () => {
    const userRole = profile?.role || user?.role;
    if (userRole === "company") {
      return "Company Dashboard";
    }
    return "My Dashboard";
  };

  const getUserDisplayName = () => {
    if (profile?.company_name) {
      return profile.company_name;
    }
    if (user?.company_name) {
      return user.company_name;
    }
    if (profile?.first_name || profile?.last_name) {
      return `${profile.first_name || ""} ${profile.last_name || ""}`.trim();
    }
    if (user?.first_name || user?.last_name) {
      return `${user.first_name || ""} ${user.last_name || ""}`.trim();
    }
    if (user?.fullName) {
      return user.fullName;
    }
    return profile?.email || user?.email || "User";
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Car className="h-8 w-8 text-parking-primary" />
              <span className="text-xl font-bold text-parking-primary">
                PARKACCESS
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/parking-lots"
              className="text-gray-600 hover:text-parking-secondary px-3 py-2 rounded-md text-sm font-medium"
            >
              Find Parking
            </Link>
            <Link
              to="/"
              className="text-gray-600 hover:text-parking-secondary px-3 py-2 rounded-md text-sm font-medium"
            >
              How It Works
            </Link>
            <Link
              to="/"
              className="text-gray-600 hover:text-parking-secondary px-3 py-2 rounded-md text-sm font-medium"
            >
              Pricing
            </Link>

            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      {(profile?.role || user?.role) === "company" ? (
                        <Building2 className="h-4 w-4" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                      <span className="max-w-32 truncate">
                        {getUserDisplayName()}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link
                        to={getDashboardLink()}
                        className="flex items-center"
                      >
                        {(profile?.role || user?.role) === "company" ? (
                          <Building2 className="mr-2 h-4 w-4" />
                        ) : (
                          <User className="mr-2 h-4 w-4" />
                        )}
                        {getDashboardLabel()}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button
                    variant="outline"
                    className="flex border border-parking-primary text-parking-primary bg-white items-center gap-1"
                  >
                    <LogIn className="h-4 w-4" />
                    Login
                  </Button>
                </Link>
                <Link to="/sign-up">
                  <Button className="bg-parking-secondary hover:bg-white hover:border hover:border-parking-primary hover:text-parking-primary">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-parking-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-parking-secondary"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className={`md:hidden ${isMobileMenuOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
          <Link
            to="/parking-lots"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-parking-primary hover:bg-gray-50"
          >
            Find Parking
          </Link>
          <Link
            to="/how-it-works"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-parking-primary hover:bg-gray-50"
          >
            How It Works
          </Link>
          <Link
            to="/pricing"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-parking-primary hover:bg-gray-50"
          >
            Pricing
          </Link>

          {isLoggedIn ? (
            <div className="border-t border-gray-200 pt-3">
              <div className="px-3 py-2">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {getUserDisplayName()}
                </p>
                <p className="text-xs text-gray-500">
                  {profile?.email || user?.email}
                </p>
              </div>
              <Link
                to={getDashboardLink()}
                className="block px-3 py-2 rounded-md text-base font-medium text-parking-primary hover:text-parking-secondary hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {getDashboardLabel()}
              </Link>
              <button
                onClick={() => {
                  handleSignOut();
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-50"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex flex-col space-y-2 p-3 border-t border-gray-200">
              <Link
                to="/login"
                className="w-full"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-1"
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
              </Link>
              <Link
                to="/sign-up"
                className="w-full"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Button className="w-full bg-parking-secondary hover:bg-parking-primary">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
