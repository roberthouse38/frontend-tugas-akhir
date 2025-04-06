import React, { useEffect, useState } from "react";
import axios from "axios";

export default function OrderDetail({ orderId, onBack }) {
  const [order, setOrder] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`http://localhost:3000/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrder(res.data));
  }, [orderId]);

  if (!order) return <div>Loading...</div>;

  return (
    <div className="mt-4">
      <button onClick={onBack} className="text-blue-500 underline mb-2">
        ← Kembali
      </button>
      <h2 className="text-lg font-semibold">Detail Pesanan #{order.id}</h2>
      <div>Status: {order.status}</div>
      <div>Alamat: {order.shipping_address}</div>
      <div className="mt-2 font-semibold">Item:</div>
      <ul>
        {order.items.map((item, index) => (
          <li key={index}>
            {item.product_name} - {item.quantity} x Rp{item.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
