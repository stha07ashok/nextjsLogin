"use client";
import React, { useEffect, useState } from "react";
import { TbHomeSpark } from "react-icons/tb";
import { FaRegCircleUser } from "react-icons/fa6";
import { HiMenu, HiX } from "react-icons/hi";
import Link from "next/link";
import DarkMode from "./darkMode";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem("user");
      const token = localStorage.getItem("authToken");
      setIsLoggedIn(!!(user && token));
    };

    checkAuth();

    const handleAuthChange = (e: CustomEvent) => {
      setIsLoggedIn(e.detail);
    };

    window.addEventListener("authChange", handleAuthChange as EventListener);
    return () => {
      window.removeEventListener("authChange", handleAuthChange as EventListener);
    };
  }, []);

  const navLinks = [
    { href: "/", label: "Home", icon: <TbHomeSpark /> },
    {
      href: isLoggedIn ? "/profile" : "/login",
      label: isLoggedIn ? "Profile" : "Login",
      icon: <FaRegCircleUser />,
    },
  ];

  return (
    <nav className="relative z-50 mx-4 sm:mx-8 lg:mx-12 my-4 sm:my-6">
      <div className="flex items-center justify-between px-4 sm:px-8 py-3 sm:py-4 bg-green-500 dark:bg-green-600 rounded-2xl shadow-lg">
        {/* Logo / Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 text-white font-bold text-xl tracking-tight"
        >
          <TbHomeSpark className="text-2xl" />
          <span className="hidden sm:inline">AuthApp</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 text-white/90 hover:text-white text-lg font-medium transition-colors"
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
          <DarkMode />
        </div>

        {/* Mobile right side */}
        <div className="flex md:hidden items-center gap-3">
          <DarkMode />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white text-2xl p-1"
            aria-label="Toggle menu"
          >
            {menuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="absolute top-full left-4 right-4 mt-2 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-slide-down md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-6 py-4 text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-green-500/10 transition-colors text-lg font-medium border-b border-gray-100 dark:border-gray-800"
            >
              <span className="text-green-500">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
