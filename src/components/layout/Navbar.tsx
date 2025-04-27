import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Car, Menu, X, User, LogIn } from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // This would come from auth context in a real implementation
  const isLoggedIn = false;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Car className="h-8 w-8 text-parking-primary" />
              <span className="text-xl font-bold text-parking-primary">PARKACCESS</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/parking-lots" className="text-gray-600 hover:text-parking-secondary px-3 py-2 rounded-md text-sm font-medium">
              Find Parking
            </Link>
            <Link to="/how-it-works" className="text-gray-600 hover:text-parking-secondary px-3 py-2 rounded-md text-sm font-medium">
              How It Works
            </Link>
            <Link to="/pricing" className="text-gray-600 hover:text-parking-secondary px-3 py-2 rounded-md text-sm font-medium">
              Pricing
            </Link>
            
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="flex items-center text-parking-primary hover:text-parking-secondary">
                  <User className="mr-1 h-4 w-4" />
                  <span>My Account</span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="outline" className="flex items-center gap-1">
                    <LogIn className="h-4 w-4" />
                    Login
                  </Button>
                </Link>
                <Link to="/sign-up">
                  <Button className="bg-parking-secondary hover:bg-parking-primary">Sign Up</Button>
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
              {isMobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
          <Link to="/parking-lots" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-parking-primary hover:bg-gray-50">
            Find Parking
          </Link>
          <Link to="/how-it-works" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-parking-primary hover:bg-gray-50">
            How It Works
          </Link>
          <Link to="/pricing" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-parking-primary hover:bg-gray-50">
            Pricing
          </Link>
          
          {isLoggedIn ? (
            <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-parking-primary hover:text-parking-secondary hover:bg-gray-50">
              My Account
            </Link>
          ) : (
            <div className="flex flex-col space-y-2 p-3">
              <Link to="/login" className="w-full">
                <Button variant="outline" className="w-full flex items-center justify-center gap-1">
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
              </Link>
              <Link to="/sign-up" className="w-full">
                <Button className="w-full bg-parking-secondary hover:bg-parking-primary">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
