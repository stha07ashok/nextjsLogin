"use client";

import { loginFormDataProps } from "@/types/login";
import Link from "next/link";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import api from "../api/user/routes";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import GoogleSignIn from "@/components/googleSignIn";
import Loader from "@/components/Loader";
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { isAxiosError } from "axios";

const getErrorMessage = (error: unknown): string =>
  isAxiosError(error) ? error.response?.data?.message || "Something went wrong, please try again." : "Something went wrong, please try again.";

const LoginPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginFormDataProps>();

  const handleForgotPassword = async () => {
    const { value: email } = await Swal.fire({
      title: "Enter your email",
      input: "email",
      inputLabel: "We'll send you a password reset link",
      inputPlaceholder: "example@gmail.com",
      showCancelButton: true,
      confirmButtonText: "Send",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#22c55e",
    });

    if (email) {
      try {
        const res = await api.post("/forgetpassword", { email });
        Swal.fire({
          icon: "success",
          title: "Reset Link Sent",
          text: res.data.message,
          position: "top",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: getErrorMessage(error),
          position: "top",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      }
    }
  };

  const onSubmit: SubmitHandler<loginFormDataProps> = async (data) => {
    setLoading(true);
    try {
      const res = await api.post("/login", data);
      localStorage.setItem("authToken", res.data.authToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      router.push("/");
      window.dispatchEvent(new CustomEvent("authChange", { detail: true }));
      Swal.fire({
        icon: "success",
        title: "Login Successful!",
        position: "top",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: getErrorMessage(error),
        position: "top",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-8">
      <div className="animate-fade-in w-full max-w-md">
        <div className="bg-white dark:bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-white/10">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-green-500 mb-8">
            Welcome Back
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="email" className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-200">
                Email
              </label>
              <div className="relative">
                <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="email"
                  id="email"
                  placeholder="example@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-white/20 rounded-xl bg-transparent focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all text-base"
                  {...register("email", { required: "Email is required" })}
                />
              </div>
              {errors.email && (
                <span className="text-xs text-red-500 mt-1 block">{errors.email.message}</span>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-200">
                Password
              </label>
              <div className="relative">
                <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-2.5 border border-gray-300 dark:border-white/20 rounded-xl bg-transparent focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all text-base"
                  {...register("password", { required: "Password is required" })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                </button>
              </div>
              {errors.password && (
                <span className="text-xs text-red-500 mt-1 block">{errors.password.message}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer text-base flex items-center justify-center gap-2"
            >
              {loading && <Loader />}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 text-gray-500">or continue with</span>
            </div>
          </div>

          <div className="flex justify-center">
            <GoogleSignIn mode="login" />
          </div>

          <div className="mt-6 space-y-3 text-center text-sm">
            <p className="text-gray-600 dark:text-gray-300">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-green-500 hover:text-green-600 font-semibold transition-colors">
                Sign up
              </Link>
            </p>
            <button
              onClick={handleForgotPassword}
              className="text-green-500 hover:text-green-600 font-medium transition-colors cursor-pointer"
            >
              Forgot password?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
