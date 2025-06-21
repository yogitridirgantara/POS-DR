"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/db";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Grafik() {
  const [salesData, setSalesData] = useState([]);
  const [productSummary, setProductSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("omzet");

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("transactions")
      .select("created_at, total, items")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Gagal mengambil data:", error.message);
      setLoading(false);
      return;
    }

    const dailyStats = {};
    const productCount = {};

    data.forEach((trx) => {
      const date = new Date(trx.created_at).toISOString().split("T")[0];

      if (!dailyStats[date]) {
        dailyStats[date] = { omzet: 0, count: 0 };
      }

      dailyStats[date].omzet += trx.total;
      dailyStats[date].count += 1;

      trx.items?.forEach((item) => {
        if (!productCount[item.product]) {
          productCount[item.product] = 0;
        }
        productCount[item.product] += item.quantity;
      });
    });

    setSalesData(
      Object.entries(dailyStats).map(([date, stats]) => ({
        date,
        omzet: stats.omzet,
        transactions: stats.count,
      }))
    );

    setProductSummary(
      Object.entries(productCount)
        .map(([name, qty]) => ({ name, qty }))
        .sort((a, b) => b.qty - a.qty)
    );

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">
            Memuat data grafik...
          </p>
        </div>
      </div>
    );
  }

  const lineChartData = {
    labels: salesData.map((d) => d.date),
    datasets: [
      {
        label: "Omzet Harian",
        data: salesData.map((d) => d.omzet),
        borderColor: "rgb(255, 193, 7)",
        backgroundColor: "rgba(255, 193, 7, 0.3)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const barChartData = {
    labels: salesData.map((d) => d.date),
    datasets: [
      {
        label: "Jumlah Transaksi",
        data: salesData.map((d) => d.transactions),
        backgroundColor: "rgba(59, 130, 246, 0.7)",
      },
    ],
  };

  const doughnutChartData = {
    labels: productSummary.slice(0, 5).map((p) => p.name),
    datasets: [
      {
        label: "Produk Terlaris",
        data: productSummary.slice(0, 5).map((p) => p.qty),
        backgroundColor: [
          "#facc15",
          "#60a5fa",
          "#34d399",
          "#f87171",
          "#a78bfa",
        ],
        borderWidth: 1,
      },
    ],
  };

  const renderChart = () => {
    switch (activeTab) {
      case "omzet":
        return <Line data={lineChartData} options={{ responsive: true }} />;
      case "transaksi":
        return <Bar data={barChartData} options={{ responsive: true }} />;
      case "produk":
        return (
          <Doughnut data={doughnutChartData} options={{ responsive: true }} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 sm:p-6 text-white max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Dashboard Performa Penjualan
      </h2>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-6 flex-wrap">
        {[
          { key: "omzet", label: "Omzet Harian" },
          { key: "transaksi", label: "Jumlah Transaksi" },
          { key: "produk", label: "Produk Terlaris" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-md font-semibold transition-colors text-sm sm:text-base ${
              activeTab === tab.key
                ? "bg-yellow-400 text-black"
                : "bg-gray-800 text-white hover:bg-yellow-300 hover:text-black"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Chart container */}
      <div className="bg-gray-900 p-4 sm:p-6 rounded-lg shadow">
        <div className="w-full h-[300px] sm:h-[400px]">{renderChart()}</div>
      </div>
    </div>
  );
}
