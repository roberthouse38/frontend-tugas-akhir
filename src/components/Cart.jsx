import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Cart() {
  const [items, setItems] = useState([]);
  const [shipping, setShipping] = useState("");

  const token = localStorage.getItem("token"); // pastikan token disimpan

  useEffect(() => {
    axios
      .get("http://localhost:3000/carts", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setItems(res.data));
  }, []);

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
      <h2 className="text-xl font-semibold mb-2">Keranjang</h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className="border p-2 rounded">
            <div className="font-medium">{item.name}</div>
            <div>Qty: {item.quantity}</div>
            <div>Total: Rp{item.total}</div>
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <input
          type="text"
          className="border rounded p-2 w-full mb-2"
          placeholder="Alamat pengiriman"
          value={shipping}
          onChange={(e) => setShipping(e.target.value)}
        />
        <button className="btn w-full" onClick={handleCheckout}>
          Buat Pesanan
        </button>
      </div>
    </div>
  );
}
