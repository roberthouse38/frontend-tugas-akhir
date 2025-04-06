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
  <form onSubmit={handleAddProduct} className="bg-gray-100 p-6 rounded-lg shadow-md space-y-4 mt-6">
    <h3 className="text-lg font-bold text-gray-800">Tambah Produk Baru</h3>
    {message && <p className="text-sm text-green-600">{message}</p>}

    <div>
      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
        Nama Produk
      </label>
      <input
        type="text"
        id="name"
        name="name"
        placeholder="Contoh: Baju Keren"
        className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
        value={newProduct.name}
        onChange={handleInputChange}
        required
      />
    </div>

    <div>
      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
        Deskripsi
      </label>
      <textarea
        id="description"
        name="description"
        placeholder="Deskripsi produk"
        className="mt-1 w-full p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring focus:ring-blue-200"
        rows="3"
        value={newProduct.description}
        onChange={handleInputChange}
        required
      />
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Harga (Rp)
        </label>
        <input
          type="number"
          id="price"
          name="price"
          placeholder="10000"
          className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
          value={newProduct.price}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
          Stok
        </label>
        <input
          type="number"
          id="stock"
          name="stock"
          placeholder="Jumlah stok"
          className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
          value={newProduct.stock}
          onChange={handleInputChange}
          required
        />
      </div>
    </div>

    <div>
      <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
        ID Kategori
      </label>
      <input
        type="number"
        id="category_id"
        name="category_id"
        placeholder="Contoh: 1"
        className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
        value={newProduct.category_id}
        onChange={handleInputChange}
        required
      />
    </div>

    <button
      type="submit"
      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded w-full transition duration-200"
    >
      Tambahkan Produk
    </button>
  </form>
)}


    </div>
  );
}
