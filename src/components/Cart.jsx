import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Cart({ token, darkMode }) {
  const [items, setItems] = useState([]);
  const [shipping, setShipping] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!token) return;

    setIsLoading(true);
    axios
      .get("http://localhost:3000/carts", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setItems(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Gagal mengambil keranjang:", err);
        setError("Gagal memuat keranjang belanja");
        setIsLoading(false);
      });
  }, [token]);

  const handleCheckout = () => {
    if (!shipping.trim()) {
      setError("Alamat pengiriman harus diisi");
      return;
    }

    setIsCheckingOut(true);
    setError("");

    axios
      .post(
        "http://localhost:3000/orders",
        { shipping_address: shipping },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setSuccess("Pesanan berhasil dibuat!");
        setItems([]);
        setShipping("");
      })
      .catch((err) => {
        setError(
          `Gagal membuat pesanan: ${
            err.response?.data?.message || err.message
          }`
        );
      })
      .finally(() => {
        setIsCheckingOut(false);
      });
  };

  const handleRemoveItem = (itemId) => {
    axios
      .delete(`http://localhost:3000/carts/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setItems(items.filter((item) => item.id !== itemId));
        setSuccess("Item berhasil dihapus dari keranjang");
      })
      .catch((err) => {
        setError("Gagal menghapus item dari keranjang");
      });
  };

  // Fungsi pembantu untuk memastikan nilai total berbentuk number
  const parseCurrency = (value) => {
    return parseFloat(String(value).replace(/[^\d.-]/g, "")) || 0;
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + parseCurrency(item.total), 0);
  };

  return (
    <div>
      <h2 className="fw-bold mb-4">Keranjang Belanja</h2>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success" role="alert">
          {success}
        </div>
      )}

      {isLoading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Memuat keranjang belanja...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-cart-x" style={{ fontSize: "3rem" }}></i>
          <h5 className="mt-3">Keranjang belanja kosong</h5>
          <p className="text-muted">Isi produk pilihan kamu di laman Produk</p>
        </div>
      ) : (
        <>
          <div className="card mb-4">
            <div className="card-header bg-light">
              <div className="row">
                <div className="col-5">Produk</div>
                <div className="col-2 text-center">Qty</div>
                <div className="col-3 text-end">Harga</div>
                <div className="col-2 text-end">Aksi</div>
              </div>
            </div>
            <div className="card-body p-0">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="row border-bottom p-3 mx-0 align-items-center"
                >
                  <div className="col-5 fw-medium">{item.name}</div>
                  <div className="col-2 text-center">{item.quantity}</div>
                  <div className="col-3 text-end">
                    Rp {parseCurrency(item.total).toLocaleString("id-ID")}
                  </div>
                  <div className="col-2 text-end">
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      🗑️ Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="card-footer">
              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-bold">Total</span>
                <span className="fw-bold fs-5">
                  Rp {getTotalPrice().toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title mb-3">Informasi Pengiriman</h5>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="shippingAddress"
                  placeholder="Masukkan alamat pengiriman"
                  value={shipping}
                  onChange={(e) => setShipping(e.target.value)}
                  required
                />
                <label htmlFor="shippingAddress">Alamat Pengiriman</label>
              </div>
              <button
                className="btn btn-primary w-100 py-2"
                onClick={handleCheckout}
                disabled={isCheckingOut || items.length === 0}
              >
                {isCheckingOut ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Memproses...
                  </>
                ) : (
                  "Buat Pesanan"
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
