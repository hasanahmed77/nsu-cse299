"use client";

import { useState } from "react";
import { api } from "../../lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    try {
      await api("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setMessage("Logged in.");
    } catch (err: any) {
      setMessage(err.message || "Failed to login");
    }
  }

  return (
    <div className="max-w-md mx-auto bg-panel p-6 rounded-lg">
      <h1 className="text-2xl font-bold">Login</h1>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
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
        <button className="w-full bg-primary text-white py-2 rounded-md">Sign In</button>
      </form>
      {message && <div className="text-sm text-muted mt-3">{message}</div>}
    </div>
  );
}
