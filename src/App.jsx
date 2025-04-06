import React, { useState, useEffect } from "react";
import Cart from "./components/Cart";
import Orders from "./components/Orders";
import OrderDetail from "./components/OrderDetail";
import Login from "./components/Login";
import Register from "./components/Register";
import Products from "./components/Products";
import { jwtDecode } from "jwt-decode";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  const [view, setView] = useState("cart");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userRole, setUserRole] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");


  // Update tampilan global saat darkMode berubah
  useEffect(() => {
    document.body.className = darkMode ? 'bg-dark text-light' : 'bg-light text-dark';
  }, [darkMode]);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role);
      } catch (err) {
        console.error("Gagal decode token", err);
        setUserRole(null);
      }
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUserRole(null);
    setView("login");
  };

  // Jika belum login
  if (!token) {
    return (
      <div className={`min-vh-100 d-flex flex-column justify-content-center align-items-center ${darkMode ? 'bg-dark text-light' : 'bg-light text-dark'} px-4 py-5`}>
        <div className={`p-4 rounded-4 shadow w-100 max-w-md ${darkMode ? 'bg-secondary text-white' : 'bg-white'}`}>
          <h1 className="text-center fw-bold mb-4">Selamat Datang</h1>

          <div className="d-flex justify-content-center gap-3 mb-4">
            <button
              className={`btn ${view === "login" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setView("login")}
            >
              Login
            </button>
            <button
              className={`btn ${view === "register" ? "btn-success" : "btn-outline-success"}`}
              onClick={() => setView("register")}
            >
              Register
            </button>
          </div>

          {view === "login" && (
            <Login
              onLogin={(token) => {
                setToken(token);
                localStorage.setItem("token", token);
                setView("cart");
              }}
            />
          )}
          {view === "register" && <Register onRegister={() => setView("login")} />}
        </div>

        <button className="btn btn-sm btn-secondary mt-4" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>
    );
  }

  // Jika sudah login
  return (
    <div className={`min-vh-100 px-4 py-5 ${darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
      <header className="text-center mb-4">
        <h1 className="fw-bold">🛒 E-Commerce UI</h1>
        <p className="text-muted">Tugas Akhir Praktikum SBD - Kelompok 27</p>
        <button className="btn btn-sm btn-danger mt-2" onClick={handleLogout}>Logout</button>
        <br />
        <button className="btn btn-sm btn-secondary mt-2" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
        </button>
      </header>

      <nav className="d-flex justify-content-center gap-2 mb-4">
        {userRole === "pembeli" && (
          <>
            <button
              className={`btn ${view === "cart" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setView("cart")}
            >
              Keranjang
            </button>
            <button
              className={`btn ${view === "orders" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setView("orders")}
            >
              Pesanan
            </button>
          </>
        )}
        <button
          className={`btn ${view === "products" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setView("products")}
        >
          Produk
        </button>
      </nav>

      <main className={`container p-4 rounded-4 shadow ${darkMode ? 'bg-secondary text-light' : 'bg-white'}`}>
        {view === "cart" && userRole === "pembeli" && <Cart token={token} />}
        {view === "orders" && userRole === "pembeli" && (
          <>
            <Orders token={token} onSelectOrder={setSelectedOrder} />
            {selectedOrder && (
              <OrderDetail
                token={token}
                orderId={selectedOrder}
                onBack={() => setSelectedOrder(null)}
              />
            )}
          </>
        )}
        {view === "products" && <Products token={token} role={userRole} />}
      </main>
    </div>
  );
}
