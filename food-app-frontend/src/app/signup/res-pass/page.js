"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ResetPassword() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [errEmail, setErrEmail] = useState("");

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email);
  const formOk = emailOk;

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!emailOk) {
      setErrEmail("Invalid email. Use a format like example@gmail.com");
      return;
    }
    setErrEmail("");

    if (typeof window !== "undefined") {
      localStorage.setItem("signup_email", email);
    }
    router.push("/signup/password");
  };

  return (
    <main className="min-h-screen bg-white flex justify-center items-center gap-25">
      <div className="w-100">
        <button
          className="grid h-10 w-10 place-items-center rounded-lg border border-gray-200 text-xl"
          aria-label="Back"
          type="button"
          onClick={() => router.back()}
        >
          ‹
        </button>

        <h1 className="mt-6 text-2xl font-extrabold text-neutral-900">
          Reset your password
        </h1>
        <p className="text-l text-gray-500">
          Enter your email to receive a password reset link.
        </p>

        <form onSubmit={handleLogin} className="mt-6 space-y-5" noValidate>
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrEmail("");
              }}
              placeholder="Enter your email address"
              autoComplete="email"
              className={[
                "h-12 w-full rounded-lg border bg-white p-4 text-base outline-none",
                errEmail
                  ? "border-red-400 focus:ring-2 focus:ring-red-200"
                  : "border-gray-200 focus:ring-2 focus:ring-gray-200",
              ].join(" ")}
            />
            {errEmail && (
              <p className="mt-2 text-[15px] text-red-600">{errEmail}</p>
            )}
          </div>

          <button
            type="submit"
            className="h-12 w-full rounded-lg text-base font-semibold bg-neutral-900 text-white"
          >
            Send link
          </button>

          <p className="text-center text-gray-500">
            Don’t have an account?
            <button
              type="button"
              className="ml-2 font-medium text-blue-600 underline"
              onClick={() => router.push("/login")}
            >
              Sign up
            </button>
          </p>
        </form>
      </div>

      <div>
        <img src="/Login.png" alt="Login" className="w-250 h-250" />
      </div>
    </main>
  );
}
