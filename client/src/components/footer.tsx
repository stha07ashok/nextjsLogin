import React from "react";

const Footer = () => {
  return (
    <footer className="w-full py-6 px-4 border-t border-gray-300 text-center shadow-xl ">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-black text-sm">
        <p className="mb-2 sm:mb-0 ">© 2025 All rights reserved.</p>
        <div className="flex space-x-4">
          <a href="#" className="hover:underline">
            Privacy Policy
          </a>
          <a href="#" className="hover:underline">
            Terms
          </a>
          <a href="#" className="hover:underline">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
