"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import api from "../../api/user/routes";
import { MdLock, MdLockReset } from "react-icons/md";
import { isAxiosError } from "axios";

// Axios error message
const getErrorMessage = (error: unknown): string =>
  isAxiosError(error) ? error.response?.data?.message || "Failed to reset password." : "Failed to reset password.";

// Reset password page
const ResetPasswordPage = () => {
  const { token } = useParams();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Handle reset
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "Passwords don't match!",
        position: "top",
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true,
      });
      return;
    }

    try {
      await api.post(`/resetpassword/${token}`, { password });
      Swal.fire({
        icon: "success",
        title: "Password Reset Successful!",
        position: "top",
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true,
      });
      router.push("/login");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: getErrorMessage(error),
        position: "top",
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true,
      });
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-8">
      <div className="animate-fade-in w-full max-w-md">
        <div className="bg-white dark:bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-white/10">
          <div className="text-center mb-8">
            <MdLockReset className="text-5xl text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-green-500">Reset Password</h2>
          </div>

          <form onSubmit={handleReset} className="space-y-5">
            <div>
              <label htmlFor="password" className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-200">
                New Password
              </label>
              <div className="relative">
                <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="password"
                  id="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-white/20 rounded-xl bg-transparent focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all text-base"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-200">
                Confirm Password
              </label>
              <div className="relative">
                <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-white/20 rounded-xl bg-transparent focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all text-base"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer text-base"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
