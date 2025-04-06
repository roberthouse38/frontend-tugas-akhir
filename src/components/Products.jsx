import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Products({ token, role }) {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: "",
  });
  const [message, setMessage] = useState("");

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/products");
      setProducts(response.data);
    } catch (err) {
      console.error("Gagal fetch produk", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await axios.post("http://localhost:3000/products", newProduct, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage("Produk berhasil ditambahkan");
      fetchProducts();
      setNewProduct({
        name: "",
        description: "",
        price: "",
        stock: "",
        category_id: "",
      });
    } catch (err) {
      console.error("Gagal tambah produk", err.response?.data || err);
      setMessage("Gagal menambahkan produk");
    }
  };

  // Tambahkan produk ke keranjang
  const tambahKeKeranjang = async (productId) => {
    try {
      await axios.post(
        "http://localhost:3000/carts",
        { product_id: productId, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Produk berhasil ditambahkan ke keranjang!");
    } catch (err) {
      console.error("Gagal tambah ke keranjang", err);
      alert("Gagal menambahkan ke keranjang");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Daftar Produk</h2>
      <ul className="space-y-2 mb-6">
        {products.map((product) => (
          <li key={product.id} className="border p-3 rounded bg-white shadow">
            <strong>{product.name}</strong> - Rp {product.price.toLocaleString()} <br />
            Stok: {product.stock} | Kategori ID: {product.category_id}
            <p className="text-sm text-gray-600 mt-1">{product.description}</p>

            {role === "pembeli" && (
              <button
                onClick={() => tambahKeKeranjang(product.id)}
                className="mt-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Tambah ke Keranjang
              </button>
            )}
          </li>
        ))}
      </ul>

      {/* Form Tambah Produk - hanya untuk penjual */}
      {role === "penjual" && (
        <form onSubmit={handleAddProduct} className="space-y-3 bg-gray-100 p-4 rounded">
          <h3 className="font-semibold">Tambah Produk Baru</h3>
          {message && <p className="text-sm text-green-600">{message}</p>}
          <input
            type="text"
            name="name"
            placeholder="Nama Produk"
            className="w-full p-2 border rounded"
            value={newProduct.name}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="description"
            placeholder="Deskripsi"
            className="w-full p-2 border rounded"
            value={newProduct.description}
            onChange={handleInputChange}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Harga"
            className="w-full p-2 border rounded"
            value={newProduct.price}
            onChange={handleInputChange}
            required
          />
          <input
            type="number"
            name="stock"
            placeholder="Stok"
            className="w-full p-2 border rounded"
            value={newProduct.stock}
            onChange={handleInputChange}
            required
          />
          <input
            type="number"
            name="category_id"
            placeholder="Kategori ID"
            className="w-full p-2 border rounded"
            value={newProduct.category_id}
            onChange={handleInputChange}
            required
          />
          <button type="submit" className="bg-blue-500 text-white w-full p-2 rounded">
            Tambahkan Produk
          </button>
        </form>
      )}
    </div>
  );
}
