import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Cart() {
  const [items, setItems] = useState([]);
  const [shipping, setShipping] = useState("");

  const token = localStorage.getItem("token"); // pastikan token disimpan

  useEffect(() => {
    if (!token) return; // jaga-jaga jika token tidak tersedia
  
    axios
      .get("http://localhost:3000/carts", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setItems(res.data))
      .catch((err) => console.error("Gagal mengambil keranjang:", err));
  }, [token]);
  

  const handleCheckout = () => {
    axios
      .post(
        "http://localhost:3000/orders",
        { shipping_address: shipping },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => alert("Pesanan berhasil dibuat!"))
      .catch((err) => alert("Gagal buat pesanan: " + err.message));
  };




  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Keranjang Belanja</h2>
      <h5 className="text-2xl font-bold mb-4 text-blue-600">Isi Produk Pilihan Kamu di Laman Produk :)</h5>
      
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.id} className="p-4 border border-gray-200 rounded-lg shadow-sm">
            <div className="text-lg font-semibold">{item.name}</div>
            <div className="text-gray-600">Qty: {item.quantity}</div>
            <div className="text-green-600 font-medium">Total: Rp{item.total}</div>
          </li>
        ))}
      </ul>
  
      <div className="mt-6">
        <input
          type="text"
          className="border border-gray-300 rounded-lg p-2 w-full mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Alamat pengiriman"
          value={shipping}
          onChange={(e) => setShipping(e.target.value)}
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 px-4 rounded-lg transition"
          onClick={handleCheckout}
        >
          Buat Pesanan
        </button>
      </div>
    </div>
  );
  

}
