
import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-parking-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Description */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <Car className="h-8 w-8 text-white" />
              <span className="text-xl font-bold">PARKACCESS</span>
            </Link>
            <p className="mt-4 text-sm text-gray-300">
              Making urban parking simple, efficient, and stress-free for drivers across Ilorin city.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Services</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/parking-lots" className="text-gray-300 hover:text-white text-sm">Find Parking</Link>
              </li>
              <li>
                <Link to="/register-lot" className="text-gray-300 hover:text-white text-sm">Register Your Lot</Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-300 hover:text-white text-sm">Pricing</Link>
              </li>
              <li>
                <Link to="/business" className="text-gray-300 hover:text-white text-sm">For Businesses</Link>
              </li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Company</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white text-sm">About Us</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-300 hover:text-white text-sm">How It Works</Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-white text-sm">Terms of Service</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-white text-sm">Privacy Policy</Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Contact</h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-300 mr-2" />
                <span className="text-gray-300 text-sm">Ilorin City, Kwara State, Nigeria</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-gray-300 mr-2" />
                <span className="text-gray-300 text-sm">+234 801 234 5678</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-gray-300 mr-2" />
                <span className="text-gray-300 text-sm">support@parkaccess.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-700">
          <p className="text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} PARKACCESS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
