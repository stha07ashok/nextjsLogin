"use client";

import { loginFormDataProps } from "@/types/login";
import Link from "next/link";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import api from "../api/user/routes";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const LoginPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginFormDataProps>();

  // ✅ Forgot Password Handler
  const handleForgotPassword = async () => {
    const { value: email } = await Swal.fire({
      title: "Enter your email",
      input: "email",
      inputLabel: "We'll send you a password reset link",
      inputPlaceholder: "example@gmail.com",
      showCancelButton: true,
      confirmButtonText: "Send",
      cancelButtonText: "Cancel",
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
          text:
            (error as any)?.response?.data?.message ||
            "Something went wrong, please try again.",
          position: "top",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      }
    }
  };

  // ✅ Login Form Submission
  const onSubmit: SubmitHandler<loginFormDataProps> = async (data) => {
    try {
      const res = await api.post("/login", data);

      localStorage.setItem("authToken", res.data.authToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      router.push("/");

      window.dispatchEvent(new CustomEvent("authChange", { detail: true }));

      Swal.fire({
        icon: "success",
        title: "Login Successful!",
        text: "You have successfully logged in.",
        position: "top",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text:
          (error as any)?.response?.data?.message ||
          "Something went wrong, please try again.",
        position: "top",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      });
    }
  };

  return (
    <div className="min-h-screen text-2xl text-black flex items-center justify-center">
      <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg space-y-6 mt-10">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <h2 className="text-5xl font-bold text-center text-green-600 border-b-2 border-gray-300 pb-4 mb-4 shadow-md">
            Login!!
          </h2>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block mb-1 font-medium text-gray-700"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              placeholder="example@gmail.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <span className="text-sm text-red-600 mt-1 block">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block mb-1 font-medium text-gray-700"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <span className="text-sm text-red-600 mt-1 block">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <input
            type="submit"
            value="Login"
            className="w-full bg-green-400 hover:bg-green-600 font-semibold py-2 px-4 rounded-lg transition duration-200 hover:cursor-pointer hover:text-white"
          />
        </form>

        {/* Register Link */}
        <p className="align-baseline font-medium mt-4 text-xl">
          Haven&apos;t an account? Please{" "}
          <Link
            href="/register"
            className="text-green-400 hover:text-green-600 underline transition duration-200"
          >
            register
          </Link>
        </p>

        {/* Forgot Password */}
        <p
          className="text-green-400 hover:text-green-600 underline transition duration-200 hover:cursor-pointer"
          onClick={handleForgotPassword}
        >
          Forgot Password?
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
