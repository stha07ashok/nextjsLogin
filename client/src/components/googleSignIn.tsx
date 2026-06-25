"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

interface GoogleSignInProps {
  mode?: "login" | "register";
}

function decodeJwt<T>(token: string): T | null {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

const GoogleSignIn = ({ mode = "login" }: GoogleSignInProps) => {
  const router = useRouter();
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google && buttonRef.current) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
          callback: (response: { credential: string }) => {
            const payload = decodeJwt<{
              email: string;
              name?: string;
              picture?: string;
            }>(response.credential);
            if (payload?.email) {
              localStorage.setItem("authToken", response.credential);
              localStorage.setItem(
                "user",
                JSON.stringify({
                  email: payload.email,
                  name: payload.name || "",
                  picture: payload.picture || "",
                  isGoogleUser: true,
                })
              );
              window.dispatchEvent(
                new CustomEvent("authChange", { detail: true })
              );
              Swal.fire({
                icon: "success",
                title: `${mode === "login" ? "Login" : "Registration"} Successful!`,
                position: "top",
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true,
              });
              router.push("/");
            }
          },
        });
        window.google.accounts.id.renderButton(buttonRef.current!, {
          theme: "outline",
          size: "large",
          shape: "rectangular",
          text: mode === "login" ? "continue_with" : "signup_with",
          width: 304,
        });
      }
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [mode, router]);

  return <div ref={buttonRef} />;
};

export default GoogleSignIn;
