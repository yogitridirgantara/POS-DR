"use client";

import { useState } from "react";
import { supabase } from "@/lib/db";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccess(false);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage("Email atau password salah!");
    } else {
      setSuccess(true);
      setMessage("");
      setTimeout(() => {
        router.push("/kasir/dashboard");
      }, 2000); // Redirect setelah 2 detik
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 relative">
      {/* Popup berhasil login */}
      {success && (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded shadow-lg text-sm font-medium animate-bounce">
          ✅ Login berhasil! Mengarahkan ke dashboard...
        </div>
      )}

      <div className="max-w-md w-full bg-gray-900 p-8 rounded-lg shadow-lg border border-gray-700">
        <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">
          Login Kasir
        </h2>

        {message && (
          <p className="text-sm text-red-400 text-center mb-4">{message}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
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
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded transition-colors"
          >
            Login
          </button>
        </form>

        <div className="mt-6 flex justify-between text-sm text-gray-300">
          <button
            onClick={() => router.push("/register")}
            className="hover:text-yellow-400 transition-colors"
          >
            Belum punya akun? Register
          </button>
          <button
            onClick={() => router.push("/")}
            className="hover:text-yellow-400 transition-colors"
          >
            Kembali ke Beranda
          </button>
        </div>

        {/* Akun demo*/}
        <div className="mt-6 p-4 bg-white border border-gray-400 text-gray-800 rounded text-sm">
          <p className="font-semibold mb-1">Login Akun Demo:</p>
          <p>
            Email: <span className="font-medium">nakocex302@ethsms.com</span>
          </p>
          <p>
            Password: <span className="font-medium">123456</span>
          </p>
          <p className="mt-2 text-gray-500">
            Gunakan akun ini untuk mencoba fitur aplikasi.
          </p>
        </div>
      </div>
    </div>
  );
}
