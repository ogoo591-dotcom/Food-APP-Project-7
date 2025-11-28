"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ZuunIcon } from "../_icons/ZuunIcon";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [errEmail, setErrEmail] = useState("");
  const [errPass, setErrPass] = useState("");

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email);
  const passOk = pass.length >= 6;
  const formOk = emailOk && passOk;

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formOk) {
      if (!emailOk)
        setErrEmail("Invalid email. Use a format like example@gmail.com");
      if (!passOk) setErrPass("Incorrect password. Please try again.");
      return;
    }

    setErrEmail("");
    setErrPass("");

    try {
      const res = await fetch("http://localhost:4000/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass }),
      });

      if (!res.ok) {
        const msg = await res.text();
        setErrPass(msg || "Invalid email or password.");
        return;
      }

      const data = await res.json();

      const token = data?.token;
      const userId =
        data?.user?._id ?? data?.userId ?? data?._id ?? data?.id ?? null;

      const userEmail = data?.user?.email || data?.email || email;

      if (!token) {
        setErrPass("No token returned from server.");
        return;
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);

        if (userId) localStorage.setItem("user_id", String(userId));

        if (userEmail) localStorage.setItem("user_email", userEmail);
      }

      router.push("/");
    } catch (err) {
      console.error(err);
      setErrPass("Network error. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-white flex justify-center items-center gap-25">
      <div className="w-100">
        <button
          className="grid h-10 w-10 place-items-center rounded-lg border border-gray-200 text-xl"
          aria-label="Back"
          onClick={() => {
            router.push("/");
          }}
        >
          <ZuunIcon />
        </button>

        <h1 className="mt-6 text-2xl font-extrabold text-neutral-900">
          Log in
        </h1>
        <p className="mt-2 text-lg text-gray-500">
          Log in to enjoy your favorite dishes.
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
              placeholder="example@gmail.com"
              autoComplete="email"
              className={[
                "h-12 w-full rounded-lg border bg-white px-4 text-base outline-none",
                errEmail
                  ? "border-red-400 focus:ring-2 focus:ring-red-200"
                  : "border-gray-200 focus:ring-2 focus:ring-gray-200",
              ].join(" ")}
            />
            {errEmail && (
              <p className="mt-2 text-[15px] text-red-600">{errEmail}</p>
            )}
          </div>
          <div className="relative">
            <input
              type="password"
              value={pass}
              onChange={(e) => {
                setPass(e.target.value);
                setErrPass("");
              }}
              placeholder="Example1234"
              autoComplete="current-password"
              className={[
                "h-12 w-full rounded-lg border bg-white px-4 text-base outline-none",
                errPass
                  ? "border-red-400 focus:ring-2 focus:ring-red-200"
                  : "border-gray-200 focus:ring-2 focus:ring-gray-200",
              ].join(" ")}
            />
            {errPass && (
              <p className="mt-2 text-[15px] text-red-600">{errPass}</p>
            )}
          </div>

          <div className="flex justify-between">
            <a
              className="text-neutral-800 underline underline-offset-4 text-sm"
              href="#"
              onClick={() => {
                router.push("/signup/res-pass");
              }}
            >
              Forgot password ?
            </a>
          </div>

          <button
            type="submit"
            disabled={!formOk}
            className={`h-12 w-full rounded-lg text-base font-semibold ${
              !formOk
                ? "bg-gray-300 text-white cursor-not-allowed"
                : "bg-neutral-900 text-white hover:opacity-90"
            }`}
          >
            Let’s Go
          </button>

          <p className="text-center text-gray-500">
            Don’t have an account?
            <a
              className="ml-2 font-medium text-blue-600 underline"
              href="#"
              onClick={() => {
                router.push("/signup");
              }}
            >
              Sign up
            </a>
          </p>
        </form>
      </div>
      <div>
        <img src="/Login.png" alt="Login" className="w-250 h-250" />
      </div>
    </main>
  );
}
