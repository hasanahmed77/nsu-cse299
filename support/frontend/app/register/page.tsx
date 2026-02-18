"use client";

import { useState } from "react";
import { api } from "../../lib/api";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    try {
      await api("/api/v1/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, full_name: fullName, password }),
      });
      setMessage("Account created. You can log in now.");
    } catch (err: any) {
      setMessage(err.message || "Failed to register");
    }
  }

  return (
    <div className="max-w-md mx-auto bg-panel p-6 rounded-lg">
      <h1 className="text-2xl font-bold">Create Account</h1>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <input
          type="text"
          placeholder="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded-md px-4 py-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded-md px-4 py-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded-md px-4 py-2"
        />
        <button className="w-full bg-primary text-white py-2 rounded-md">Register</button>
      </form>
      {message && <div className="text-sm text-muted mt-3">{message}</div>}
    </div>
  );
}
