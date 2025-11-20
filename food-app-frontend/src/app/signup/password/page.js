"use client";
import { ZuunIcon } from "@/app/_icons/ZuunIcon";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errPassword, setErrPassword] = useState("");
  const [errConfirm, setErrConfirm] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("signup_email");
    if (!stored) {
      router.push("/signup");
      return;
    }
    setEmail(stored);
  }, [router]);

  const passwordStrong = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(password);
  const confirmOk = confirm.length > 0 && password === confirm;
  const formOk = passwordStrong && confirmOk;

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;

    if (!passwordStrong) {
      setErrPassword("Weak password. Use numbers and symbols.");
      hasError = true;
    } else {
      setErrPassword("");
    }

    if (!confirmOk) {
      setErrConfirm("Passwords do not match.");
      hasError = true;
    } else {
      setErrConfirm("");
    }

    if (hasError) return;

    let tokenFromServer = "";
    try {
      const res = await fetch("http://localhost:4000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const raw = await res.text();
      let data = null;
      try {
        data = JSON.parse(raw);
      } catch {}
      if (res.ok && data?.token) {
        tokenFromServer = data.token;
      } else {
        console.warn("Signup server error:", res.status, raw);
      }
    } catch (err) {
      console.error("Signup network error:", err);
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("token", tokenFromServer);
      localStorage.setItem("user_email", email);

      window.dispatchEvent(new Event("auth:changed"));
    }
    router.push("/login");
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
          <ZuunIcon />
        </button>

        <h1 className="mt-6 text-2xl font-extrabold text-neutral-900">
          Create a strong password
        </h1>
        <p className="mt-2 text-lg text-gray-500">
          Create a strong password with letters, numbers.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
          <div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrPassword("");
              }}
              placeholder="Password"
              autoComplete="new-password"
              className={[
                "h-12 w-full rounded-lg border bg-white px-4 text-base outline-none",
                errPassword
                  ? "border-red-400 focus:ring-2 focus:ring-red-200"
                  : "border-gray-200 focus:ring-2 focus:ring-gray-200",
              ].join(" ")}
            />
            {errPassword && (
              <p className="mt-2 text-[15px] text-red-600">{errPassword}</p>
            )}
          </div>
          <div>
            <input
              type={showPassword ? "text" : "password"}
              value={confirm}
              onChange={(e) => {
                setConfirm(e.target.value);
                setErrConfirm("");
              }}
              placeholder="Confirm"
              autoComplete="new-password"
              className={[
                "h-12 w-full rounded-lg border bg-white px-4 text-base outline-none",
                errConfirm
                  ? "border-red-400 focus:ring-2 focus:ring-red-200"
                  : "border-gray-200 focus:ring-2 focus:ring-gray-200",
              ].join(" ")}
            />
            {errConfirm && (
              <p className="mt-2 text-[15px] text-red-600">{errConfirm}</p>
            )}
          </div>
          <label className="flex gap-2 items-center cursor-pointer select-none">
            <input
              className="h-4 w-4 rounded-xl"
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword((v) => !v)}
            />
            <span className="text-neutral-500 text-sm">Show password</span>
          </label>
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
            Already have an account?
            <button
              type="button"
              className="ml-2 font-medium text-blue-600 underline"
              onClick={() => router.push("/login")}
            >
              Log in
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
