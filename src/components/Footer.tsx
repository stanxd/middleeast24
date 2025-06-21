

import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="hero-gradient text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <img src="/lovable-uploads/d7c6804d-088a-4968-a327-f9e698a51495.png" alt="MiddleEast24 Logo" className="h-10 w-10" />
              <div>
                <p className="text-sm text-gray-400">Middle East 24</p>
              </div>
            </Link>
            <p className="text-gray-400 text-sm">
              Your trusted source for Middle East news, investigations, and exclusive reporting.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="font-semibold">Categories</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">News</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Investigations</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Exclusive Sources</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold">Contact</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p>Email: news@middleeast24.com</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Address: Middle East News Center</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 MiddleEast24. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-gray-400 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="mailto:s707tan@gmail.com" className="hover:text-white transition-colors">Contact Us</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

