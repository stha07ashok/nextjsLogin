"use client";
import { registerFormDataProps } from "@/types/register";
import Link from "next/link";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import api from "../api/user/routes";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const router = useRouter();
  const [emailForVerification, setEmailForVerification] = useState("");
  const [showVerificationInput, setShowVerificationInput] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<registerFormDataProps>();

  const onSubmit: SubmitHandler<registerFormDataProps> = async (data) => {
    try {
      await api.post("/register", data); // Send email + save user temporarily
      setEmailForVerification(data.email);
      setShowVerificationInput(true);
      Swal.fire({
        icon: "info",
        title: "Verify Email",
        text: "A 6-digit code has been sent to your email. Please verify.",
        timer: 2000,
        timerProgressBar: true,
        position: "top",
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text:
          (error as any).response?.data?.message ||
          "Something went wrong. Try again.",
        timer: 2000,
        timerProgressBar: true,
        position: "top",
        showConfirmButton: false,
      });
    }
  };

  const handleVerificationSubmit = async () => {
    try {
      const res = await api.post("/verify-email", {
        email: emailForVerification,
        code: verificationCode,
      });

      console.log(res.data);

      // Navigate user to login page
      router.push("/login");

      Swal.fire({
        icon: "success",
        title: "User Verified Successfully!",
        timer: 1500,
        timerProgressBar: true,
        position: "top",
        showConfirmButton: false,
      });

      router.push("/login");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Verification Failed",
        text:
          (error as any).response?.data?.message ||
          "Invalid verification code.",
        timer: 2000,
        timerProgressBar: true,
        position: "top",
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="min-h-screen text-2xl text-black flex items-center justify-center">
      <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg space-y-6 mt-10">
        {!showVerificationInput ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <h2 className="text-5xl font-bold text-center text-green-600 border-b-2 border-gray-300 pb-4 mb-4 shadow-md">
              Please Register!!
            </h2>

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

            <input
              type="submit"
              value="Register"
              className="w-full bg-green-400 hover:bg-green-600 font-semibold py-2 px-4 rounded-lg transition duration-200 hover:cursor-pointer hover:text-white"
            />
          </form>
        ) : (
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold text-center text-green-600">
              Verify Email
            </h2>
            <input
              type="text"
              maxLength={6}
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-center"
              placeholder="Enter 6-digit code"
            />
            <button
              onClick={handleVerificationSubmit}
              className="w-full bg-green-500 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition duration-200 px-4 "
            >
              Verify and Complete Registration
            </button>
          </div>
        )}

        {!showVerificationInput && (
          <p className="align-baseline font-medium mt-4 text-xl">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-green-400 hover:text-green-600 underline"
            >
              Login
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
