"use client";
import { registerFormDataProps } from "@/types/register";
import Link from "next/link";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import api from "../api/user/routes";
import { useRouter } from "next/navigation";
import GoogleSignIn from "@/components/googleSignIn";
import Loader from "@/components/Loader";
import { MdEmail, MdLock, MdMarkEmailRead, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { isAxiosError } from "axios";

const getErrorMessage = (error: unknown): string =>
  isAxiosError(error) ? error.response?.data?.message || "Something went wrong. Try again." : "Something went wrong. Try again.";

const RegisterPage = () => {
  const router = useRouter();
  const [emailForVerification, setEmailForVerification] = useState("");
  const [showVerificationInput, setShowVerificationInput] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<registerFormDataProps>();

  const onSubmit: SubmitHandler<registerFormDataProps> = async (data) => {
    setLoading(true);
    try {
      await api.post("/register", data);
      setEmailForVerification(data.email);
      setShowVerificationInput(true);
      Swal.fire({
        icon: "info",
        title: "Verify Email",
        text: "A 6-digit code has been sent to your email.",
        timer: 2000,
        timerProgressBar: true,
        position: "top",
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: getErrorMessage(error),
        timer: 2000,
        timerProgressBar: true,
        position: "top",
        showConfirmButton: false,
      });
    }
    setLoading(false);
  };

  const handleVerificationSubmit = async () => {
    setVerifying(true);
    try {
      await api.post("/verify-email", {
        email: emailForVerification,
        code: verificationCode,
      });
      Swal.fire({
        icon: "success",
        title: "Verified Successfully!",
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
        text: getErrorMessage(error),
        timer: 2000,
        timerProgressBar: true,
        position: "top",
        showConfirmButton: false,
      });
    }
    setVerifying(false);
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-8">
      <div className="animate-fade-in w-full max-w-md">
        <div className="bg-white dark:bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-white/10">
          {!showVerificationInput ? (
            <>
              <h2 className="text-3xl md:text-4xl font-bold text-center text-green-500 mb-8">
                Create Account
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
                  placeholder="Create a password"
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
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-white/20" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white dark:bg-[#19183c] text-gray-500">or continue with</span>
                </div>
              </div>

              <div className="flex justify-center">
                <GoogleSignIn mode="register" />
              </div>

              <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
                Already have an account?{" "}
                <Link href="/login" className="text-green-500 hover:text-green-600 font-semibold transition-colors">
                  Sign in
                </Link>
              </p>
            </>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <MdMarkEmailRead className="text-5xl text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-green-500 mb-2">Verify Email</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Enter the 6-digit code sent to <span className="font-semibold">{emailForVerification}</span>
                </p>
              </div>

              <input
                type="text"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full text-center text-2xl tracking-[0.5em] py-3 border border-gray-300 dark:border-white/20 rounded-xl bg-transparent focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                placeholder="000000"
              />

              <button
                onClick={handleVerificationSubmit}
                disabled={verifying}
                className="w-full py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer text-base flex items-center justify-center gap-2"
              >
                {verifying && <Loader />}
                {verifying ? "Verifying..." : "Verify & Complete"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
