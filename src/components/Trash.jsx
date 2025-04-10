import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Trash({ token }) {
  const [deletedProducts, setDeletedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDeletedProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/products/deleted", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDeletedProducts(response.data);
      console.log("Data dari backend:", response.data);
    } catch (error) {
      console.error("Gagal mengambil produk yang dihapus:", error);
    } finally {
      setLoading(false);
    }
  };

  const restoreProduct = async (productId) => {
    try {
      await axios.put(
        `http://localhost:3000/products/restore/${productId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchDeletedProducts();
    } catch (error) {
      console.error("Gagal memulihkan produk:", error);
    }
  };

  const deleteProductPermanently = async (productId) => {
    try {
      await axios.delete(`http://localhost:3000/products/permanent/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchDeletedProducts();
    } catch (error) {
      console.error("Gagal menghapus produk secara permanen:", error);
    }
  };

  useEffect(() => {
    fetchDeletedProducts();
  }, []);

  if (loading) {
    return <p>Memuat data produk yang dihapus...</p>;
  }

  return (
    <div>
      <h4 className="mb-3">🗑️ Produk yang Dihapus</h4>
      {deletedProducts.length === 0 ? (
        <p className="text-muted">Tidak ada produk di dalam sampah.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-secondary">
              <tr>
                <th>Nama Produk</th>
                <th>Harga</th>
                <th>Deskripsi</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {deletedProducts.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>Rp {Number(product.price).toLocaleString()}</td>
                  <td>{product.description}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-success me-2"
                      onClick={() => restoreProduct(product.id)}
                    >
                      ♻️ Pulihkan
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteProductPermanently(product.id)}
                    >
                      🗑️ Hapus Permanen
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
