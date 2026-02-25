"use client";

import { useState } from "react";
import { api } from "../../lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setMessage(null);
    try {
      await api("/api/v1/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, full_name: fullName, password }),
      });
      setMessage("Account created. You can log in now.");
      router.push("/login");
    } catch (err: any) {
      setMessage(err.message || "Failed to register");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-[calc(100dvh-96px)] px-4 flex items-center justify-center">
      <div className="w-full max-w-md bg-zinc-950 border border-white/10 p-6 rounded-lg">
        <h1 className="text-3xl font-display tracking-wider">Create Account</h1>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <input
            type="text"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={submitting}
            className="w-full bg-black/60 border border-white/10 rounded-md px-4 py-3 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/30"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
            className="w-full bg-black/60 border border-white/10 rounded-md px-4 py-3 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/30"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={submitting}
            className="w-full bg-black/60 border border-white/10 rounded-md px-4 py-3 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/30"
          />
          <button
            disabled={submitting}
            className="w-full bg-primary text-black py-2 rounded-md font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Creating account..." : "Register"}
          </button>
          {submitting ? (
            <div className="gmail-loader-track" aria-label="Creating account">
              <span className="gmail-loader-bar" />
            </div>
          ) : null}
        </form>
        <p className="text-sm text-zinc-400 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-white hover:underline">
            Sign in
          </Link>
        </p>
        {message && <div className="text-sm text-zinc-400 mt-3">{message}</div>}
      </div>
    </div>
  );
}
