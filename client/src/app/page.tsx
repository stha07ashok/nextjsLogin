import Link from "next/link";
import { MdSecurity, MdEmail, MdSpeed } from "react-icons/md";

const features = [
  {
    icon: <MdSecurity className="text-3xl" />,
    title: "Secure Authentication",
    desc: "Industry-standard encryption and secure password hashing to keep your data safe.",
  },
  {
    icon: <MdEmail className="text-3xl" />,
    title: "Email Verification",
    desc: "Verify your email with a 6-digit code to ensure account authenticity.",
  },
  {
    icon: <MdSpeed className="text-3xl" />,
    title: "Fast & Reliable",
    desc: "Built with Next.js 15 for blazing-fast performance and seamless user experience.",
  },
];

export default function Page() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center px-4 py-12">
      {/* Hero */}
      <div className="animate-fade-in text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-5xl md:text-7xl font-extrabold text-green-500 mb-6 tracking-tight">
          Welcome Home
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          A modern, secure authentication platform. Sign up, log in, and manage
          your account with ease.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center"
          >
            Get Started
          </Link>
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-3 border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white font-semibold rounded-xl transition-all duration-300 text-center"
          >
            Create Account
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full animate-fade-in" style={{ animationDelay: "0.2s" }}>
        {features.map((f, i) => (
          <div
            key={i}
            className="group bg-white dark:bg-white/10 backdrop-blur-sm p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-white/10"
          >
            <div className="text-green-500 mb-4 group-hover:scale-110 transition-transform duration-300">
              {f.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              {f.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
