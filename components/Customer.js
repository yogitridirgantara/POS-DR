"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/db";

export default function Customer() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomer();
  }, []);

  const fetchCustomer = async () => {
    const { data, error } = await supabase
      .from("transactions")
      .select("customer_name, created_at")
      .order("customer_name", { ascending: true });

    if (error) {
      console.error("Gagal mengambil data customer:", error.message);
      setLoading(false);
      return;
    }

    // Kelompokkan data berdasarkan customer_name
    const customerMap = {};

    data.forEach((item) => {
      const name = item.customer_name;
      if (!name) return;

      if (!customerMap[name]) {
        customerMap[name] = {
          name,
          total: 1,
          lastTransaction: item.created_at,
        };
      } else {
        customerMap[name].total += 1;

        if (
          new Date(item.created_at) >
          new Date(customerMap[name].lastTransaction)
        ) {
          customerMap[name].lastTransaction = item.created_at;
        }
      }
    });

    const customerList = Object.values(customerMap);
    setCustomers(customerList);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-4">Data Pelanggan</h1>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-gray-300">
          <div className="loader mb-4 animate-spin rounded-full border-4 border-t-amber-400 border-gray-700 w-12 h-12"></div>
          <p className="text-sm">Memuat data pelanggan...</p>
        </div>
      ) : customers.length === 0 ? (
        <p className="text-gray-300 text-center mt-8">
          Tidak ada data pelanggan tersedia.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg">
          <table className="w-full table-auto text-left text-white bg-gray-800 border border-gray-600">
            <thead className="bg-gray-700 text-sm uppercase text-gray-300">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Nama Pelanggan</th>
                <th className="px-4 py-3">Jumlah Transaksi</th>
                <th className="px-4 py-3">Transaksi Terakhir</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((cust, index) => (
                <tr
                  key={index}
                  className="border-t border-gray-700 hover:bg-gray-700 transition"
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2 font-medium">{cust.name}</td>
                  <td className="px-4 py-2">{cust.total}</td>
                  <td className="px-4 py-2 text-gray-300">
                    {new Date(cust.lastTransaction).toLocaleDateString(
                      "id-ID",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
