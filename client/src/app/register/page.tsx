"use client";
import { registerFormDataProps } from "@/types/register";
import Link from "next/link";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<registerFormDataProps>();
  const onSubmit: SubmitHandler<registerFormDataProps> = (data) =>
    console.log(data);
  return (
    <div className=" min-h-screen text-2xl text-black flex items-center justify-center ">
      <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg space-y-6 mt-10">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <h2 className="text-5xl font-bold text-center text-green-600 border-b-2 border-gray-300 pb-4 mb-4 shadow-md">
            Please Register!!
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
            value="register"
            className="w-full bg-green-400 hover:bg-green-600  font-semibold py-2 px-4 rounded-lg transition duration-200 hover:cursor-pointer hover:text-white"
          />
        </form>
        <p className="align-baseline font-medium mt-4 text-xl">
          Haven&apos;t an account? Please {""}
          <Link
            href="/login"
            className="text-green-400 hover:text-green-600 underline  transition duration-200 "
          >
            login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
