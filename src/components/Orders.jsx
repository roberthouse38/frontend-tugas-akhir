import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Orders({ token, onSelectOrder }) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("http://localhost:3000/orders", { 
        headers: { Authorization: `Bearer ${token}` } 
      })
      .then((res) => {
        setOrders(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Gagal memuat pesanan:", err);
        setError("Gagal memuat daftar pesanan");
        setIsLoading(false);
      });
  }, [token]);

  // Fungsi bantuan untuk menampilkan status pesanan dengan lebih baik
  const getStatusBadge = (status) => {
    const statusMap = {
      "pending": { text: "Menunggu", className: "bg-warning" },
      "processing": { text: "Diproses", className: "bg-info" },
      "shipped": { text: "Dikirim", className: "bg-primary" },
      "delivered": { text: "Diterima", className: "bg-success" },
      "cancelled": { text: "Dibatalkan", className: "bg-danger" },
    };
    
    const statusInfo = statusMap[status.toLowerCase()] || { text: status, className: "bg-secondary" };
    
    return (
      <span className={`badge ${statusInfo.className}`}>
        {statusInfo.text}
      </span>
    );
  };

  // Format tanggal dengan lebih baik
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <div>
      <h2 className="fw-bold mb-4">Pesanan Saya</h2>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Memuat daftar pesanan...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-box-seam" style={{ fontSize: "3rem" }}></i>
          <h5 className="mt-3">Belum ada pesanan</h5>
          <p className="text-muted">Pesanan Anda akan muncul di sini setelah checkout</p>
        </div>
      ) : (
        <div className="list-group">
          {orders.map((order) => (
            <button
              key={order.id}
              className="list-group-item list-group-item-action d-flex flex-column align-items-start"
              onClick={() => onSelectOrder(order.id)}
            >
              <div className="d-flex w-100 justify-content-between align-items-center mb-1">
                <h5 className="mb-1">Pesanan #{order.id}</h5>
                {getStatusBadge(order.status)}
              </div>
              <div className="d-flex w-100 justify-content-between">
                <p className="mb-1 text-muted">
                  <small>{formatDate(order.created_at)}</small>
                </p>
                <span className="fw-bold">Rp {order.total_price?.toLocaleString('id-ID')}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}