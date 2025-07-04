
import React, { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Main header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <img src="/lovable-uploads/d7c6804d-088a-4968-a327-f9e698a51495.png" alt="MiddleEast24 Logo" className="h-12 w-12" />
            <div>
              <p className="text-sm text-gray-600 uppercase tracking-wider">Middle East 24</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-navy-900 font-medium transition-colors">Home</Link>
            
            
            
            <Link to="/about" className="text-gray-700 hover:text-navy-900 font-medium transition-colors">About</Link>
            <Link to="/contact" className="text-gray-700 hover:text-navy-900 font-medium transition-colors">Contact</Link>
          </nav>

          {/* Search and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              
            </button>
            
            <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && <nav className="lg:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-700 hover:text-navy-900 font-medium" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <a href="#" className="text-gray-700 hover:text-navy-900 font-medium">News</a>
              <a href="#" className="text-gray-700 hover:text-navy-900 font-medium">Investigations</a>
              <a href="#" className="text-gray-700 hover:text-navy-900 font-medium">Exclusive Sources</a>
              <Link to="/about" className="text-gray-700 hover:text-navy-900 font-medium" onClick={() => setIsMenuOpen(false)}>
                About
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-navy-900 font-medium" onClick={() => setIsMenuOpen(false)}>
                Contact
              </Link>
            </div>
          </nav>}
      </div>
    </header>;
};
export default Header;
