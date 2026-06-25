"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../api/user/routes";
import Swal from "sweetalert2";
import { FaRegCircleUser } from "react-icons/fa6";
import { MdLogout, MdEmail } from "react-icons/md";
import Link from "next/link";
import Loader from "@/components/Loader";

const ProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await api.post("/logout", {}, { withCredentials: true });
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.dispatchEvent(new CustomEvent("authChange", { detail: false }));
      Swal.fire({
        icon: "success",
        title: "Logout Successful!",
        position: "top",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      });
      router.push("/");
    } catch {
      Swal.fire({
        icon: "error",
        title: "Logout Failed",
        text: "Something went wrong, please try again.",
        position: "top",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      });
    }
    setLoggingOut(false);
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-8">
      <div className="animate-fade-in w-full max-w-sm">
        <div className="bg-white dark:bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center">
            <FaRegCircleUser className="text-4xl text-green-500" />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">Profile</h2>

          {user?.email && (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-300 mb-6">
              <MdEmail className="text-green-500" />
              {user.email}
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-500 hover:bg-red-600 disabled:bg-red-400 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg"
            >
              {loggingOut ? <Loader /> : <MdLogout className="text-lg" />}
              {loggingOut ? "Logging out..." : "Logout"}
            </button>

            <Link
              href="/"
              className="block w-full py-2.5 border border-gray-300 dark:border-white/20 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-200 text-sm font-medium text-gray-600 dark:text-gray-300 text-center"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
