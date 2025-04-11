import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

export default function OrderHistory({ token }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

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
  }, [token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      await axios.patch(
        `http://localhost:3000/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update status pada state lokal
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.order_id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Gagal mengubah status:", error);
      alert("Gagal mengubah status pesanan.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

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
                Status:{" "}
                <strong className="me-2">{order.status}</strong>
                <select
                  className="form-select form-select-sm d-inline w-auto"
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                  disabled={updatingOrderId === order.order_id}
                >
                  <option value="pending">Menunggu</option>
                  <option value="processing">Diproses</option>
                  <option value="shipped">Dikirim</option>
                  <option value="delivered">Diterima</option>
                  <option value="cancelled">Dibatalkan</option>
                </select>
              </p>

              <p className="card-text mb-2">
                Tanggal: {new Date(order.created_at).toLocaleString("id-ID")}
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
                      <td>Rp {Number(item.price).toLocaleString("id-ID")}</td>
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
