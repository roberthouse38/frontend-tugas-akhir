import React, { useEffect, useState } from "react";
import axios from "axios";

export default function OrderDetail({ orderId, onBack, token }) {
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`http://localhost:3000/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setOrder(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Gagal memuat detail pesanan:", err);
        setError("Gagal memuat detail pesanan");
        setIsLoading(false);
      });
  }, [orderId, token]);

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
    if (!dateString) return "";
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // Hitung total pesanan
  const calculateTotal = (items) => {
    if (!items) return 0;
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (isLoading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Memuat detail pesanan...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
        <div className="mt-3">
          <button onClick={onBack} className="btn btn-outline-secondary">
            <i className="bi bi-arrow-left me-1"></i> Kembali
          </button>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="card shadow-sm border-0 mt-4">
      <div className="card-header bg-white py-3">
        <div className="d-flex justify-content-between align-items-center">
          <button onClick={onBack} className="btn btn-sm btn-outline-secondary">
            <i className="bi bi-arrow-left me-1"></i> Kembali
          </button>
          {getStatusBadge(order.status)}
        </div>
      </div>
      <div className="card-body">
        <div className="row mb-4">
          <div className="col-md-6">
            <h5 className="card-title">Detail Pesanan #{order.id}</h5>
            <p className="card-text text-muted mb-0">
              <small>Tanggal Pesanan: {formatDate(order.created_at)}</small>
            </p>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <h6 className="mb-1">Alamat Pengiriman:</h6>
              <p className="mb-0">{order.shipping_address}</p>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>Produk</th>
                <th className="text-center">Qty</th>
                <th className="text-end">Harga</th>
                <th className="text-end">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item, index) => (
                <tr key={index}>
                  <td>{item.product_name}</td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-end">Rp {item.price?.toLocaleString('id-ID')}</td>
                  <td className="text-end">Rp {(item.price * item.quantity)?.toLocaleString('id-ID')}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="table-light">
              <tr>
                <td colSpan="3" className="text-end fw-bold">Total</td>
                <td className="text-end fw-bold">Rp {calculateTotal(order.items)?.toLocaleString('id-ID')}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}