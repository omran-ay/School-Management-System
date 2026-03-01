import { Mail, Phone, School } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <School className="text-green-500" size={28} />
              <span className="font-bold text-xl text-white">
                School Manager
              </span>
            </div>
            <p className="text-sm">
              Empowering educational institutions with modern management
              solutions.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/features"
                  className="hover:text-green-400 transition"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-green-400 transition">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-green-400 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-green-400 transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="hover:text-green-400 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-green-400 transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="hover:text-green-400 transition">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <address className="not-italic space-y-2">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                support@schoolmanager.com
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                (123) 456-7890
              </p>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center">
          <p>© {currentYear} School Manager. All rights reserved.</p>
          <p className="mt-2">Designed with ❤️ for educators worldwide</p>
        </div>
      </div>
    </footer>
  );
}
