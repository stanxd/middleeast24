import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter } from 'lucide-react';

const Footer = () => {
  return (
<footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <img src="/lovable-uploads/d7c6804d-088a-4968-a327-f9e698a51495.png" alt="MiddleEast24 Logo" className="h-10 w-10" />
              <div>
                <p className="text-[#FFFFFF] text-base font-bold">Middle East 24</p>
              </div>
            </Link>
            <p className="text-gray-400 text-sm">
              Your trusted source for Middle East news, investigations, and exclusive reporting.
            </p>
            {/* Social Media */}
            <div className="flex space-x-4">
              <a href="https://twitter.com/Middleeast_24" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
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
              <li><Link to="/?tab=news" className="hover:text-white transition-colors">News</Link></li>
              <li><Link to="/?tab=investigations" className="hover:text-white transition-colors">Investigations</Link></li>
              <li><Link to="/?tab=exclusive" className="hover:text-white transition-colors">Exclusive Sources</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold">Contact</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p>Email: news@middleeast24.org</p>
              <p>Phone: +1 (000) 123-4567</p>
              <p>Address: Middle East News Center</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 MiddleEast24. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-gray-400 mt-4 md:mt-0">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
            <a href="mailto:news@middleeast24.org" className="hover:text-white transition-colors">Contact Us</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
