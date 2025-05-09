"use client";
import React, { useEffect, useState } from "react";
import { TbHomeSpark } from "react-icons/tb";
import { FaRegCircleUser } from "react-icons/fa6";
import Link from "next/link";
import DarkMode from "./darkMode";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status on client and listen for changes
  useEffect(() => {
    const checkAuth = async () => {
      const user = localStorage.getItem("user");
      const token = localStorage.getItem("authToken");
      if (user && token) {
        setIsLoggedIn(true);
      }
    };

    // Check on initial load
    checkAuth();

    // Listen for changes in login status
    const handleAuthChange = (e: CustomEvent) => {
      setIsLoggedIn(e.detail); // Update the login state when event is fired
    };

    // Attach the event listener
    window.addEventListener("authChange", handleAuthChange as EventListener);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener(
        "authChange",
        handleAuthChange as EventListener
      );
    };
  }, []);

  return (
    <nav className="flex items-center justify-between px-10 py-4 mx-12  my-6 bg-green-400 rounded-2xl shadow-lg">
      {/* Left side */}
      <div className="flex items-center space-x-6">
        <Link
          href="/"
          className="flex items-center space-x-2 text-black text-2xl hover:text-white transition-colors"
        >
          <TbHomeSpark />
          <span className="hidden sm:inline">Home</span>
        </Link>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-6">
        <div className="text-3xl space-y-3 text-black dark:text-white">
          <DarkMode />
        </div>

        {isLoggedIn ? (
          <Link
            href="/profile"
            className="flex items-center space-x-2 text-black text-2xl hover:text-white transition-colors"
          >
            <FaRegCircleUser />
            <span className="hidden sm:inline">Profile</span>
          </Link>
        ) : (
          <Link
            href="/login"
            className="flex items-center space-x-2 text-black text-2xl hover:text-white transition-colors"
          >
            <FaRegCircleUser />
            <span className="hidden sm:inline">Login</span>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
