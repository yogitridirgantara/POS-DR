// Tambahkan ke bagian atas komponen
import { useEffect, useState } from "react";
import { supabase } from "../lib/db";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [newProduct, setNewProduct] = useState({
    product: "",
    description: "",
    category: "",
    price: "",
    image: "",
  });
  const [newPreviewImage, setNewPreviewImage] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("product")
      .select("*")
      .order("product", { ascending: true });
    if (error) setError(error.message);
    else setProducts(data);
    setLoading(false);
  };

  const filteredProducts =
    categoryFilter === "all"
      ? products
      : products.filter((p) => p.category.toLowerCase() === categoryFilter);

  const truncate = (text, maxLength) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const handleNewInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleNewImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `product-images/${fileName}`;

    let { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, file);
    if (uploadError) return alert("Upload gagal");

    const { data: urlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);
    setNewProduct((prev) => ({ ...prev, image: urlData.publicUrl }));
    setNewPreviewImage(urlData.publicUrl);
  };

  const handleCreateProduct = async () => {
    const { product, description, category, price, image } = newProduct;
    if (!product || !price || isNaN(price)) return alert("Data tidak valid");

    const { error } = await supabase
      .from("product")
      .insert([
        { product, description, category, price: Number(price), image },
      ]);
    if (error) return alert("Gagal menambah");

    setNewProduct({
      product: "",
      description: "",
      category: "",
      price: "",
      image: "",
    });
    setNewPreviewImage("");
    setIsModalOpen(false);
    fetchProducts();
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setPreviewImage(product.image);
    setIsEditModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct({ ...editingProduct, [name]: value });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !editingProduct) return;

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `product-images/${fileName}`;

    let { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, file);
    if (uploadError) return alert("Upload gagal");

    const { data: urlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);
    await supabase
      .from("product")
      .update({ image: urlData.publicUrl })
      .eq("id", editingProduct.id);
    setEditingProduct((prev) => ({ ...prev, image: urlData.publicUrl }));
    setPreviewImage(urlData.publicUrl);
  };

  const handleUpdate = async () => {
    const { id, product, description, category, price, image } = editingProduct;
    const { error } = await supabase
      .from("product")
      .update({ product, description, category, price, image })
      .eq("id", id);
    if (error) return alert("Gagal update");
    setIsEditModalOpen(false);
    fetchProducts();
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus produk ini?")) return;
    const { error } = await supabase.from("product").delete().eq("id", id);
    if (error) return alert("Gagal hapus");
    fetchProducts();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Memuat produk...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white">
      <div className="flex flex-wrap gap-2 justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Daftar Produk</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded font-bold w-full sm:w-auto"
        >
          Tambah Produk
        </button>
      </div>

      {/* Filter */}
      <div className="mb-6 flex flex-wrap gap-2 justify-center sm:justify-start">
        <button
          onClick={() => setCategoryFilter("all")}
          className={`px-4 py-2 mr-2 rounded ${
            categoryFilter === "all"
              ? "bg-yellow-500 text-black"
              : "bg-gray-700"
          }`}
        >
          Semua
        </button>
        <button
          onClick={() => setCategoryFilter("makanan")}
          className={`px-4 py-2 mr-2 rounded ${
            categoryFilter === "makanan"
              ? "bg-yellow-500 text-black"
              : "bg-gray-700"
          }`}
        >
          Makanan
        </button>
        <button
          onClick={() => setCategoryFilter("minuman")}
          className={`px-4 py-2 rounded ${
            categoryFilter === "minuman"
              ? "bg-yellow-500 text-black"
              : "bg-gray-700"
          }`}
        >
          Minuman
        </button>
      </div>

      {/* Produk grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((p) => (
          <div key={p.id} className="bg-gray-800 p-4 rounded-lg flex flex-col">
            <img
              src={p.image}
              alt={p.product}
              className="h-40 w-full object-cover mb-2 rounded"
            />
            <h3 className="text-lg font-bold">{p.product}</h3>
            <p className="text-sm text-gray-300 mb-1">
              {truncate(p.description, 60)}
            </p>
            <p className="font-semibold mb-2">Rp {p.price}</p>
            <div className="mt-auto flex gap-2 flex-wrap">
              <button
                onClick={() => handleEdit(p)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded w-full sm:w-auto"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded w-full sm:w-auto"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Tambah */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 px-4 py-6 md:p-12 rounded-lg w-full max-w-md mx-4">
            <h3 className="text-lg font-bold mb-6">Tambah Produk</h3>
            <input
              name="product"
              placeholder="Nama"
              value={newProduct.product}
              onChange={handleNewInputChange}
              className="w-full mb-4 p-4 bg-gray-800 text-white rounded"
            />
            <textarea
              name="description"
              placeholder="Deskripsi"
              value={newProduct.description}
              onChange={handleNewInputChange}
              className="w-full mb-2 p-6 bg-gray-800 text-white rounded"
            />
            <select
              name="category"
              value={newProduct.category}
              onChange={handleNewInputChange}
              className="w-full mb-4 p-4 bg-gray-800 text-white rounded"
            >
              <option value="">Pilih Kategori</option>
              <option value="makanan">Makanan</option>
              <option value="minuman">Minuman</option>
            </select>

            <input
              name="price"
              type="number"
              placeholder="Harga"
              value={newProduct.price}
              onChange={handleNewInputChange}
              className="w-full mb-4 p-4 bg-gray-800 text-white rounded"
            />
            <input
              type="file"
              onChange={handleNewImageChange}
              className="w-full mb-4"
            />
            {newPreviewImage && (
              <img
                src={newPreviewImage}
                className="h-40 object-cover rounded mb-2"
              />
            )}
            <div className="flex justify-end gap-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-600 text-white px-8 py-2 rounded"
              >
                Batal
              </button>
              <button
                onClick={handleCreateProduct}
                className="bg-yellow-500 text-black px-8 py-2 rounded font-bold"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit */}
      {isEditModalOpen && editingProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 px-4 py-6 md:p-12 rounded-lg w-full max-w-md mx-4">
            <h3 className="text-lg font-bold mb-6">Edit Produk</h3>
            <input
              name="product"
              value={editingProduct.product}
              onChange={handleInputChange}
              className="w-full mb-4 p-4 bg-gray-800 text-white rounded"
            />
            <textarea
              name="description"
              value={editingProduct.description}
              onChange={handleInputChange}
              className="w-full mb-2 p-6 bg-gray-800 text-white rounded"
            />
            <select
              name="category"
              value={editingProduct.category}
              onChange={handleInputChange}
              className="w-full mb-4 p-4 bg-gray-800 text-white rounded"
            >
              <option value="">Pilih Kategori</option>
              <option value="makanan">Makanan</option>
              <option value="minuman">Minuman</option>
            </select>

            <input
              name="price"
              type="number"
              value={editingProduct.price}
              onChange={handleInputChange}
              className="w-full mb-4 p-4 bg-gray-800 text-white rounded"
            />
            <input
              type="file"
              onChange={handleImageChange}
              className="w-full mb-4"
            />
            {previewImage && (
              <img
                src={previewImage}
                className="h-40 object-cover rounded mb-2"
              />
            )}
            <div className="flex justify-end gap-6">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-gray-600 text-white px-8 py-2 rounded"
              >
                Batal
              </button>
              <button
                onClick={handleUpdate}
                className="bg-yellow-500 text-black px-8 py-2 rounded font-bold"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
