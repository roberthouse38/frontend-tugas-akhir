import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Orders({ onSelectOrder }) {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:3000/orders", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setOrders(res.data));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Pesanan Saya</h2>
      <ul className="space-y-2">
        {orders.map((order) => (
          
          <li
            key={order.id}
            className="border p-2 rounded cursor-pointer hover:bg-gray-100"
            onClick={() => onSelectOrder(order.id)}
          >
            <div>Total: Rp{order.total_price}</div>
            <div>Status: {order.status}</div>
            <div>{new Date(order.created_at).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
