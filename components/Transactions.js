import { useState, useEffect } from "react";
import { supabase } from "../lib/db";

export default function Transactions() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customerName, setCustomerName] = useState("");
  const [transactionNote, setTransactionNote] = useState("");

  // State tambahan untuk modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("product")
        .select("*")
        .order("product", { ascending: true });
      if (error) throw error;
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCart(
      cart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const calculateTotal = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const getDiscountRate = (total) => {
    if (total > 1_000_000) return 0.25;
    if (total > 700_000) return 0.15;
    if (total > 500_000) return 0.1;
    if (total > 300_000) return 0.05;
    return 0;
  };

  const calculateDiscount = () => {
    const total = calculateTotal();
    const discountRate = getDiscountRate(total);
    return total * discountRate;
  };

  const calculateFinalTotal = () => {
    return calculateTotal() - calculateDiscount();
  };

  const handleCheckout = () => {
    if (!customerName.trim()) {
      alert("Harap isi nama pelanggan!");
      return;
    }

    if (cart.length === 0) {
      alert("Keranjang kosong!");
      return;
    }

    setShowConfirmModal(true);
  };

  const confirmCheckout = async () => {
    const simplifiedCart = cart.map((item) => ({
      id: item.id,
      product: item.product,
      price: item.price,
      quantity: item.quantity,
    }));

    try {
      const { error } = await supabase.from("transactions").insert([
        {
          customer_name: customerName,
          items: simplifiedCart,
          total: calculateFinalTotal(),
          note: transactionNote,
          status: "completed",
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      setCart([]);
      setCustomerName("");
      setTransactionNote("");
      setShowConfirmModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Gagal menyimpan transaksi:", error?.message || error);
      setShowConfirmModal(false);
      setShowErrorModal(true);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">
            Memuat Halaman Transaksi...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <h2 className="text-xl font-semibold mb-4">Daftar Produk</h2>

        <h3 className="text-lg font-bold text-white mb-2">Makanan</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {products
            .filter((product) => product.category.toLowerCase() === "makanan")
            .map((product) => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="bg-yellow-400 p-3 rounded-lg shadow hover:bg-yellow-500 text-left"
              >
                <h3 className="font-bold text-gray-800">{product.product}</h3>
                <p className="text-gray-600 text-sm">
                  Rp{product.price.toLocaleString()}
                </p>
              </button>
            ))}
        </div>

        <h3 className="text-lg font-bold text-white mb-2">Minuman</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {products
            .filter((product) => product.category.toLowerCase() === "minuman")
            .map((product) => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="bg-yellow-400 p-3 rounded-lg shadow hover:bg-yellow-500 text-left"
              >
                <h3 className="font-bold text-gray-800">{product.product}</h3>
                <p className="text-gray-600 text-sm">
                  Rp{product.price.toLocaleString()}
                </p>
              </button>
            ))}
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Keranjang</h2>

        <div className="mb-4 text-gray-800">
          <label className="block mb-2">Nama Pelanggan</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Nama pelanggan"
          />
        </div>

        <div className="mb-4 text-gray-800">
          <label className="block mb-2">Catatan Transaksi</label>
          <textarea
            value={transactionNote}
            onChange={(e) => setTransactionNote(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Catatan..."
            rows="3"
          />
        </div>

        {cart.length === 0 ? (
          <p className="text-gray-500">Keranjang kosong</p>
        ) : (
          <>
            <div className="mb-4 text-gray-800">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center py-2 border-b"
                >
                  <div>
                    <p className="font-medium">{item.product}</p>
                    <p className="text-sm text-gray-600">
                      Rp
                      {item.price.toLocaleString()} x {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      -
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-2 text-red-500"
                      title="Hapus dari keranjang"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={4}
                          d="M20 12H4"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-1 text-gray-800">
              <p className="flex justify-between">
                <span>Subtotal:</span>
                <span>Rp {calculateTotal().toLocaleString()}</span>
              </p>
              <p className="flex justify-between text-green-600 font-medium">
                <span>
                  Diskon ({(getDiscountRate(calculateTotal()) * 100).toFixed(0)}
                  %)
                </span>
                <span>- Rp {calculateDiscount().toLocaleString()}</span>
              </p>
              <p className="flex justify-between font-bold text-lg">
                <span>Total Bayar:</span>
                <span>Rp {calculateFinalTotal().toLocaleString()}</span>
              </p>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Proses Transaksi
            </button>
          </>
        )}
      </div>

      {/* Modals */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white text-gray-800 p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Konfirmasi Transaksi</h3>
            <p className="mb-4">
              Apakah Anda yakin ingin menyelesaikan transaksi ini?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Batal
              </button>
              <button
                onClick={confirmCheckout}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Ya, Proses
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white text-green-700 p-6 rounded shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-bold mb-2">✅ Transaksi Berhasil!</h3>
            <p>Data transaksi berhasil disimpan.</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {showErrorModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white text-red-700 p-6 rounded shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-bold mb-2">
              ❌ Gagal Menyimpan Transaksi
            </h3>
            <p>
              Terjadi kesalahan saat menyimpan transaksi. Silakan coba lagi.
            </p>
            <button
              onClick={() => setShowErrorModal(false)}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
