
import React from 'react';
const Footer = () => {
    return (
      <footer className="bg-black text-gray-200 py-10 pl-10 pr-20 mt-10">
        <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">StarPhenom</h2>
            <p className="text-sm text-gray-400">
              Your ultimate destination for quality fashion & lifestyle products.
            </p>
          </div>
  
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#">Shop</a></li>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Support</a></li>
              <li><a href="#">Terms & Conditions</a></li>
            </ul>
          </div>
  
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Contact</h3>
            <ul className="text-sm text-gray-400 space-y-2">
              <li><i className="ri-mail-line mr-2" />support@starphenom.com</li>
              <li><i className="ri-phone-line mr-2" />+91-63160144208</li>
              <li><i className="ri-map-pin-line mr-2" />Mumbai, India</li>
            </ul>
          </div>
  
          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Stay Updated</h3>
            <p className="text-sm text-gray-400 mb-3">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <div className="flex items-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-3 py-2 rounded-l-md bg-gray-800 text-sm text-white focus:outline-none"
              />
              <button className="bg-blue-600 px-4 py-2 text-sm rounded-r-md hover:bg-blue-700">
                Subscribe
              </button>
            </div>
          </div>
        </div>
  
        {/* Divider */}
        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} StarPhenom. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0 text-xl">
            <a href="#" className="hover:text-white"><i className="ri-facebook-fill" /></a>
            <a href="#" className="hover:text-white"><i className="ri-instagram-line" /></a>
            <a href="#" className="hover:text-white"><i className="ri-twitter-x-line" /></a>
            <a href="#" className="hover:text-white"><i className="ri-linkedin-box-line" /></a>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  