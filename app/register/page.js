"use client";

import { useState } from "react";
import { supabase } from "@/lib/db";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setSuccess(false);

    if (!email || !password) {
      setMessage("Email dan password wajib diisi");
      return;
    }

    if (password.length < 6) {
      setMessage("Password minimal 6 karakter");
      return;
    }

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setMessage(error.message);
    } else {
      setSuccess(true);
      setMessage("");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 relative">
      {/* ✅ Popup berhasil */}
      {success && (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded shadow-lg text-sm font-medium animate-bounce">
          ✅ Berhasil mendaftar! Silakan cek email dan login...
        </div>
      )}

      <div className="max-w-md w-full bg-gray-900 p-8 rounded-lg shadow-lg border border-gray-700">
        <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">
          Register Akun
        </h2>

        {/* ⚠️ Pesan error */}
        {message && (
          <p className="text-sm text-center mb-4 text-red-400">{message}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <input
            type="password"
            placeholder="Password (min. 6 karakter)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded transition-colors"
          >
            Register
          </button>
        </form>

        <div className="mt-6 flex justify-between text-sm text-gray-300">
          <button
            onClick={() => router.push("/login")}
            className="hover:text-yellow-400 transition-colors"
          >
            Sudah punya akun? Login
          </button>
          <button
            onClick={() => router.push("/")}
            className="hover:text-yellow-400 transition-colors"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
}
