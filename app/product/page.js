"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/db";
import Link from "next/link";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("product")
      .select("*")
      .order("product", { ascending: true });

    if (error) {
      console.error("Error fetching data:", error.message);
    } else {
      setProducts(data);
      setFilteredProducts(data);
    }
    setLoading(false);
  };

  const handleFilter = (category) => {
    setActiveCategory(category);
    if (category === "all") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((item) => item.category === category)
      );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-300">
        <div className="loader mb-4 animate-spin rounded-full border-4 border-t-amber-400 border-gray-700 w-12 h-12"></div>
        <p className="text-sm">Memuat produk...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <p className="text-gray-200 text-center mt-8">
        Tidak ada produk tersedia.
      </p>
    );
  }

  return (
    <div className="text-white max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs sm:text-sm bg-yellow-500 text-black px-4 py-2 rounded-md shadow hover:bg-yellow-400 transition-all duration-200 mb-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Kembali ke Beranda
      </Link>

      {/* Filter Navigation */}
      <div className="flex flex-wrap gap-3 mb-6 justify-center mt-6">
        {["all", "makanan", "minuman"].map((cat) => (
          <button
            key={cat}
            onClick={() => handleFilter(cat)}
            className={`px-4 py-2 rounded-full transition-all text-xs sm:text-sm font-medium ${
              activeCategory === cat
                ? "bg-amber-400 text-black"
                : "bg-gray-700 hover:bg-amber-300 hover:text-black"
            }`}
          >
            {cat === "all"
              ? "Semua Produk"
              : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-gray-800 p-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
          >
            {product.image && (
              <img
                src={product.image}
                alt={product.product}
                className="w-full h-40 sm:h-48 object-cover rounded-md mb-4"
              />
            )}
            <h3 className="text-lg sm:text-xl font-semibold text-amber-400">
              {product.product}
            </h3>
            <p className="text-gray-300 text-sm my-2">{product.description}</p>
            <div className="flex justify-between items-center mt-3">
              <span className="text-xs bg-gray-700 px-2 py-1 rounded-full capitalize">
                {product.category}
              </span>
              <span className="text-amber-300 font-bold text-sm">
                Rp{product.price.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
