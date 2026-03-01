import { School, LogIn, UserPlus, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { px } from "framer-motion";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white  shadow-md sticky top-0 z-50">
      <div className=" w-full   px-6  sm:px-4  lg:px-8">
        <div className=" flex justify-between  items-center h-16 ">
          <div className=" flex-shrink-0 flex   items-center">
            <Link
              to="/"
              className="flex items-center gap-2 group"
              aria-label="Home"
            >
              <img
                className=" transition-colors"
                src="/images/image3.png"
                alt=""
                width={75}
                height={70}
              />

              <span className="font-bold text-xl text-gray-800 group-hover:text-green-700 transition-colors hidden sm:block">
                School Manager
              </span>
            </Link>
          </div>

          <div className=" hidden md:flex items-center gap-6">
            <Link
              to="/features"
              className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Features
            </Link>
            <Link
              to="/pricing"
              className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Pricing
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              About
            </Link>

            <div className="flex items-center gap-3 ml-4">
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md transition-all"
                aria-label="Login"
              >
                <LogIn size={18} />
                <span className="text-sm font-medium">Login</span>
              </Link>

              <Link
                to="/register"
                className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-sm hover:shadow-md transition-all"
                aria-label="Sign Up"
              >
                <UserPlus size={18} />
                <span className="text-sm font-medium">Sign Up</span>
              </Link>
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-green-50 focus:outline-none transition-all"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/features"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              to="/pricing"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
          </div>
          <div className="px-2 pt-2 pb-4 border-t border-gray-200">
            <Link
              to="/login"
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              <LogIn size={18} />
              Login
            </Link>
            <Link
              to="/register"
              className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <UserPlus size={18} />
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
