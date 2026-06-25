import React from "react";
import { TbHomeSpark } from "react-icons/tb";

const Footer = () => {
  return (
    <footer className="w-full py-8 px-4 bg-gray-50 dark:bg-white/5 border-t border-gray-200 dark:border-white/10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-200">
          <TbHomeSpark className="text-green-500 text-lg" />
          AuthApp
        </div>
        <p>© {new Date().getFullYear()} All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-green-500 transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-green-500 transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-green-500 transition-colors">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
