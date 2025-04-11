import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

export default function OrderHistory({ token }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gunakan useCallback agar fungsi stabil (tidak berubah setiap render)
  const fetchOrders = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3000/orders/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Gagal mengambil riwayat pesanan:", error);
    } finally {
      setLoading(false);
    }
  }, [token]); // fetchOrders hanya tergantung pada token

  useEffect(() => {
    fetchOrders(); // Panggil fungsi fetchOrders saat komponen mount
  }, [fetchOrders]); // Tambahkan fetchOrders sebagai dependensi

  if (loading) return <p>Memuat riwayat pesanan...</p>;

  return (
    <div className="container mt-4">
      <h4 className="mb-3">📦 Riwayat Pesanan</h4>

      {orders.length === 0 ? (
        <p className="text-muted">Belum ada riwayat pesanan.</p>
      ) : (
        orders.map((order) => (
          <div key={order.order_id} className="card mb-3 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Pesanan #{order.order_id}</h5>
              <p className="card-text mb-1">
                Status: <strong>{order.status}</strong>
              </p>
              <p className="card-text mb-2">
                Tanggal: {new Date(order.created_at).toLocaleString()}
              </p>

              <table className="table table-sm table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>Produk</th>
                    <th>Jumlah</th>
                    <th>Harga Satuan</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.product_name}</td>
                      <td>{item.quantity}</td>
                      <td>Rp {Number(item.price).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
