// Tambahkan import useEffect, useState, axios, dan lain-lain seperti sebelumnya
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Products({ token, role }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: "",
  });
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/products");
      setProducts(response.data);
    } catch (err) {
      setError("Gagal memuat produk");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3000/categories");
      setCategories(response.data);
    } catch (err) {
      console.error("Gagal fetch kategori", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdateProduct = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      if (editingProduct) {
        await axios.put(`http://localhost:3000/products/${editingProduct.id}`, newProduct, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Produk berhasil diperbarui");
      } else {
        await axios.post("http://localhost:3000/products", newProduct, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Produk berhasil ditambahkan");
      }
      setNewProduct({ name: "", description: "", price: "", stock: "", category_id: "" });
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      setError("Gagal menyimpan produk");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProduct = (product) => {
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category_id: product.category_id,
    });
    setEditingProduct(product);
  };

  const handleSoftDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Produk dipindahkan ke sampah");
      fetchProducts();
    } catch (err) {
      setError("Gagal menghapus produk");
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : "Tidak diketahui";
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory ? product.category_id.toString() === selectedCategory : true;
    const matchesSearch = searchQuery
      ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      <h2>Daftar Produk</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="mb-3 d-flex justify-content-between">
        <input
          className="form-control me-2"
          style={{ width: '300px' }}
          placeholder="Cari produk..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="form-select"
          style={{ width: '200px' }}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Semua Kategori</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className="row">
        {filteredProducts.map((product) => (
          <div className="col-md-4 mb-4" key={product.id}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text text-muted">{product.description}</p>
                <p className="card-text fw-bold">Rp {product.price?.toLocaleString("id-ID")}</p>
                <p className="card-text">Stok: {product.stock}</p>
                <p className="card-text"><small>Kategori: {getCategoryName(product.category_id)}</small></p>

                {role === "penjual" && (
                  <div className="d-flex justify-content-between">
                    <button className="btn btn-sm btn-warning" onClick={() => handleEditProduct(product)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleSoftDelete(product.id)}>
                      Hapus
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {role === "penjual" && (
        <div className="card mt-4">
          <div className="card-header">
            <h5>{editingProduct ? "Edit Produk" : "Tambah Produk Baru"}</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleAddOrUpdateProduct}>
              <div className="mb-3">
                <label>Nama Produk</label>
                <input
                  className="form-control"
                  name="name"
                  value={newProduct.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label>Deskripsi</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={newProduct.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Harga</label>
                  <input
                    type="number"
                    className="form-control"
                    name="price"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label>Stok</label>
                  <input
                    type="number"
                    className="form-control"
                    name="stock"
                    value={newProduct.stock}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="mb-3">
                <label>Kategori</label>
                <select
                  className="form-select"
                  name="category_id"
                  value={newProduct.category_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">-- Pilih Kategori --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : editingProduct ? "Perbarui Produk" : "Tambahkan Produk"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
