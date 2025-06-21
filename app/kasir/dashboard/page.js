"use client";

import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/db";
import Products from "@/components/Products";
import Transactions from "@/components/Transactions";
import Report from "@/components/Report";
import Grafik from "@/components/Grafik";
import Customer from "@/components/Customer";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("transactions");
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 relative">
      <Head>
        <title>Dashboard Kasir</title>
      </Head>

      {/* Header */}
      <div className="bg-gray-900 text-yellow-400 p-4 sm:p-5 shadow-md flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
        <h1 className="text-lg sm:text-xl font-bold text-center sm:text-left">
          Dashboard Kasir Dirgantara Restaurant
        </h1>
        <button
          onClick={() => setShowConfirmLogout(true)}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-1 rounded w-full sm:w-auto text-sm"
        >
          Logout
        </button>
      </div>

      {/* Tab Buttons */}
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-wrap justify-center sm:justify-start gap-3 border-b border-gray-700 pb-4 mb-6">
          <button
            className={`py-2 px-4 text-sm sm:text-base rounded-t transition duration-200 ${
              activeTab === "products"
                ? "bg-yellow-400 text-black font-semibold"
                : "hover:text-yellow-400"
            }`}
            onClick={() => setActiveTab("products")}
          >
            Produk
          </button>
          <button
            className={`py-2 px-4 text-sm sm:text-base rounded-t transition duration-200 ${
              activeTab === "transactions"
                ? "bg-yellow-400 text-black font-semibold"
                : "hover:text-yellow-400"
            }`}
            onClick={() => setActiveTab("transactions")}
          >
            Transaksi
          </button>
          <button
            className={`py-2 px-4 text-sm sm:text-base rounded-t transition duration-200 ${
              activeTab === "report"
                ? "bg-yellow-400 text-black font-semibold"
                : "hover:text-yellow-400"
            }`}
            onClick={() => setActiveTab("report")}
          >
            Report
          </button>
          <button
            className={`py-2 px-4 text-sm sm:text-base rounded-t transition duration-200 ${
              activeTab === "grafik"
                ? "bg-yellow-400 text-black font-semibold"
                : "hover:text-yellow-400"
            }`}
            onClick={() => setActiveTab("grafik")}
          >
            Grafik
          </button>
          <button
            className={`py-2 px-4 text-sm sm:text-base rounded-t transition duration-200 ${
              activeTab === "customer"
                ? "bg-yellow-400 text-black font-semibold"
                : "hover:text-yellow-400"
            }`}
            onClick={() => setActiveTab("customer")}
          >
            Customer
          </button>
        </div>

        {/* Content */}
        <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-inner">
          {activeTab === "products" && <Products />}
          {activeTab === "transactions" && <Transactions />}
          {activeTab === "report" && <Report />}
          {activeTab === "grafik" && <Grafik />}
          {activeTab === "customer" && <Customer />}
        </div>
      </div>

      {/* Modal Konfirmasi Logout */}
      {showConfirmLogout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4 text-yellow-400">
              Apakah Anda yakin ingin logout?
            </h3>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmLogout(false)}
                className="px-4 py-2 bg-gray-600 rounded text-white hover:bg-gray-500"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 rounded text-white hover:bg-red-500 font-semibold"
              >
                Ya, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
