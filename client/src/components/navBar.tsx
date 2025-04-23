import React from "react";
import { TbHomeSpark } from "react-icons/tb";
import { FaRegCircleUser } from "react-icons/fa6";
import Link from "next/link";
import DarkMode from "./darkMode";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-10 py-4 mx-12  my-6 bg-green-400 rounded-2xl shadow-lg">
      {/* Left side icons */}
      <div className="flex items-center space-x-6">
        <Link
          href="/"
          className="flex items-center space-x-2 text-black text-2xl hover:text-white transition-colors"
        >
          <TbHomeSpark />
          <span className="hidden sm:inline">Home</span>
        </Link>
      </div>
      {/*right side icons */}
      <div className="flex items-center gap-6">
        <div className="text-3xl space-y-3 text-black dark:text-white">
          <DarkMode />
        </div>

        <Link
          href="/login"
          className="flex items-center space-x-2 text-black text-2xl hover:text-white transition-colors"
        >
          <FaRegCircleUser />
          <span className="hidden sm:inline ">Login</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
