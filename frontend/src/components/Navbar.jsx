import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white fixed w-full shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            TheBag<span className="text-blue-500">Spot</span>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-8 text-lg">
            <li>
              <Link to="/" className="hover:text-blue-400 hover: scale-200">
                Home
              </Link>
            </li>
            <li>
              <Link to="/features" className="hover:text-blue-400">
                Features
              </Link>
            </li>
            <li>
              <Link to="/pricing" className="hover:text-blue-400">
                Pricing
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-blue-400">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-blue-400">
                Contact
              </Link>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 py-4 space-y-4">
          <Link
            to="/"
            className="block text-center hover:text-blue-400"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/features"
            className="block text-center hover:text-blue-400"
            onClick={() => setIsOpen(false)}
          >
            Features
          </Link>
          <Link
            to="/pricing"
            className="block text-center hover:text-blue-400"
            onClick={() => setIsOpen(false)}
          >
            Pricing
          </Link>
          <Link
            to="/about"
            className="block text-center hover:text-blue-400"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <Link
            to="/contact"
            className="block text-center hover:text-blue-400"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
