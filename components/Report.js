import { useEffect, useState } from "react";
import React from "react";
import { supabase } from "../lib/db";
import * as XLSX from "xlsx";

export default function Report() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    const today = new Date();
    const yyyyMMdd = today.toISOString().slice(0, 10);
    setStartDate(yyyyMMdd);
    setEndDate(yyyyMMdd);
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      fetchTransactions(); // akan terpanggil saat startDate & endDate sudah di-set
    }
  }, [startDate, endDate]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const start = `${startDate} 00:00:00`;
      const end = `${endDate} 23:59:59`;

      console.log("Start:", start);
      console.log("End:", end);

      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .gte("created_at", start)
        .lte("created_at", end)
        .order("created_at", { ascending: false });

      if (error) throw error;

      console.log("Fetched transactions:", data);
      setTransactions(data);
    } catch (error) {
      console.error("Gagal mengambil data transaksi:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const exportToExcel = () => {
    const dataToExport = transactions.map((t) => ({
      Pelanggan: t.customer_name,
      Total: t.total,
      Tanggal: new Date(t.created_at).toLocaleString("id-ID"),
      Catatan: t.note,
      Status: t.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Penjualan");

    XLSX.writeFile(workbook, "laporan_penjualan.xlsx");
  };

  return (
    <div className="p-4 md:p-6 text-white">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-center">
        Laporan Penjualan
      </h2>

      {/* Filter tanggal */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm mb-1">Dari Tanggal</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full bg-gray-800 text-white px-3 py-2 rounded"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm mb-1">Sampai Tanggal</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full bg-gray-800 text-white px-3 py-2 rounded"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={fetchTransactions}
            className="w-full md:w-auto bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded"
          >
            Tampilkan
          </button>
        </div>
      </div>

      {/* Export Button */}
      <div className="flex justify-between items-center mb-4 flex-col md:flex-row gap-2">
        <h2 className="text-lg md:text-2xl font-bold">Laporan</h2>
        <button
          onClick={exportToExcel}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full md:w-auto"
        >
          Unduh Excel
        </button>
      </div>

      {/* Tabel Transaksi */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-gray-300">
          <div className="loader mb-4 animate-spin rounded-full border-4 border-t-amber-400 border-gray-700 w-12 h-12"></div>
          <p className="text-sm">Memuat data laporan...</p>
        </div>
      ) : transactions.length === 0 ? (
        <p className="text-gray-400">
          Tidak ada transaksi pada rentang tanggal ini.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[600px] w-full border border-gray-600 text-sm">
            <thead className="bg-gray-700 text-left">
              <tr>
                <th className="p-3 border border-gray-600">No</th>
                <th className="p-3 border border-gray-600">Pelanggan</th>
                <th className="p-3 border border-gray-600">Total</th>
                <th className="p-3 border border-gray-600">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, i) => (
                <React.Fragment key={t.id}>
                  <tr className="hover:bg-gray-800">
                    <td className="p-3 border border-gray-700">{i + 1}</td>
                    <td className="p-3 border border-gray-700">
                      {t.customer_name}
                    </td>
                    <td className="p-3 border border-gray-700">
                      Rp {parseInt(t.total).toLocaleString()}
                    </td>
                    <td className="p-3 border border-gray-700">
                      <div className="flex flex-col gap-2">
                        <span>
                          {new Date(t.created_at).toLocaleString("id-ID", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                        <button
                          onClick={() => toggleRow(t.id)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-black text-xs px-2 py-1 rounded self-start w-max"
                        >
                          {expandedRow === t.id
                            ? "Tutup Detail"
                            : "Lihat Detail"}
                        </button>
                      </div>
                    </td>
                  </tr>

                  {expandedRow === t.id && (
                    <tr className="bg-gray-900 text-sm text-gray-300">
                      <td colSpan="4" className="p-4 border border-gray-700">
                        <p className="mb-2 font-semibold">🧾 Detail Item:</p>
                        <ul className="space-y-1 list-disc ml-5">
                          {Array.isArray(t.items) &&
                            t.items.map((item, idx) => (
                              <li key={idx}>
                                {item.product} — Rp{" "}
                                {item.price.toLocaleString()} x {item.quantity}{" "}
                                ={" "}
                                <span className="font-medium text-white">
                                  Rp{" "}
                                  {(
                                    item.price * item.quantity
                                  ).toLocaleString()}
                                </span>
                              </li>
                            ))}
                        </ul>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
