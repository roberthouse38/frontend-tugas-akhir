import React, { useState, useEffect } from "react";
import Cart from "./components/Cart";
import Orders from "./components/Orders";
import OrderDetail from "./components/OrderDetail";
import Login from "./components/Login";
import Register from "./components/Register";
import Products from "./components/Products";
import Trash from "./components/Trash";
import { jwtDecode } from "jwt-decode";
import 'bootstrap/dist/css/bootstrap.min.css';


export default function App() {
  const [view, setView] = useState("cart");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userRole, setUserRole] = useState(null);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const [loginView, setLoginView] = useState("login");

  useEffect(() => {
    document.body.className = darkMode ? 'bg-dark text-light' : 'bg-light text-dark';
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role);
      } catch (err) {
        console.error("Failed to decode token", err);
        handleLogout();
      }
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUserRole(null);
    setLoginView("login");
  };

  if (!token) {
    return (
      <div className={`min-vh-100 ${darkMode ? 'bg-gray-900 text-white' : 'bg-light'}`}>
        <div className="position-absolute top-0 end-0 m-4">
          <button 
            className={`btn btn-sm rounded-circle p-2 ${darkMode ? 'btn-outline-light' : 'btn-outline-dark'}`}
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle dark mode"
          >
            {darkMode ? '🌞' : '🌙'}
          </button>
        </div>

        <div className="container">
          <div className="row justify-content-center min-vh-100 align-items-center">
            <div className="col-md-6 col-lg-5">
              <div className={`card border-0 shadow-lg ${darkMode ? 'bg-dark text-light border-secondary' : ''}`}>
                <div className="card-body p-5">
                  <div className="text-center mb-4">
                    <h1 className="fw-bold mb-1">
                      <span className="display-5">🛒</span> 
                      <span className="ms-2">E-Commerce</span>
                    </h1>
                    <p className={`${darkMode ? 'text-light-50' : 'text-muted'} mb-0`}>
                      Tugas Akhir Praktikum SBD - Kelompok 27
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <ul className="nav nav-pills nav-fill">
                      <li className="nav-item flex-grow-1">
                        <button 
                          className={`nav-link w-100 ${loginView === "login" ? "active" : ""} 
                            ${darkMode && loginView !== "login" ? "text-light" : ""}`}
                          onClick={() => setLoginView("login")}
                        >
                          Login
                        </button>
                      </li>
                      <li className="nav-item flex-grow-1">
                        <button 
                          className={`nav-link w-100 ${loginView === "register" ? "active" : ""} 
                            ${darkMode && loginView !== "register" ? "text-light" : ""}`}
                          onClick={() => setLoginView("register")}
                        >
                          Register
                        </button>
                      </li>
                    </ul>
                  </div>

                  <div className="auth-form-container">
                    {loginView === "login" && (
                      <Login
                        onLogin={(token) => {
                          setToken(token);
                          localStorage.setItem("token", token);
                          setView("cart");
                        }}
                        goToRegister={() => setLoginView("register")}
                        darkMode={darkMode}
                      />
                    )}
                    {loginView === "register" && (
                      <Register 
                        onRegister={() => setLoginView("login")} 
                        goToLogin={() => setLoginView("login")}
                        darkMode={darkMode}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-vh-100 ${darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
      <div className="container py-4">
        <header className="d-flex flex-column flex-md-row align-items-center justify-content-between mb-4 pb-3 border-bottom">
          <div className="text-center text-md-start mb-3 mb-md-0">
            <h1 className="fw-bold h2 mb-0">
              <span className="me-2">🛒</span>
              E-Commerce UI
            </h1>
            <p className={`${darkMode ? 'text-light-50' : 'text-muted'} small mb-0`}>
              Tugas Akhir Praktikum SBD - Kelompok 27
            </p>
          </div>

          <div className="d-flex gap-2 flex-wrap justify-content-center">
            <button 
              className={`btn btn-sm ${darkMode ? 'btn-outline-light' : 'btn-outline-dark'}`}
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? '🌞 Light' : '🌙 Dark'}
            </button>
            <button className="btn btn-sm btn-danger" onClick={handleLogout}>
              <span className="me-1">👤</span> Logout
            </button>
          </div>
        </header>

        <nav className="bg-body-tertiary p-2 rounded-3 shadow-sm mb-4">
          <ul className="nav nav-pills nav-fill flex-column flex-sm-row">
            {userRole === "pembeli" && (
              <>
                <li className="nav-item">
                  <button
                    className={`nav-link px-3 ${view === "cart" ? "active" : ""}`}
                    onClick={() => setView("cart")}
                  >
                    <span className="me-1">🛒</span> Keranjang
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link px-3 ${view === "orders" ? "active" : ""}`}
                    onClick={() => setView("orders")}
                  >
                    <span className="me-1">📦</span> Pesanan
                  </button>
                </li>
              </>
            )}

            <li className="nav-item">
              <button
                className={`nav-link px-3 ${view === "products" ? "active" : ""}`}
                onClick={() => setView("products")}
              >
                <span className="me-1">🏪</span> Produk
              </button>
            </li>

            {userRole === "penjual" && (
              <li className="nav-item">
                <button
                  className={`nav-link px-3 ${view === "trash" ? "active" : ""}`}
                  onClick={() => setView("trash")}
                >
                  <span className="me-1">🗑️</span> Sampah
                </button>
              </li>
            )}
          </ul>
        </nav>

        <main className={`card border-0 rounded-4 shadow-lg ${darkMode ? 'bg-secondary bg-opacity-25 text-light' : 'bg-white'}`}>
          <div className="card-body p-4">
            {view === "cart" && userRole === "pembeli" && <Cart token={token} />}
            {view === "orders" && userRole === "pembeli" && (
              selectedOrder ? (
                <OrderDetail
                  token={token}
                  orderId={selectedOrder}
                  onBack={() => setSelectedOrder(null)}
                />
              ) : (
                <Orders token={token} onSelectOrder={setSelectedOrder} />
              )
            )}
            {view === "products" && <Products token={token} role={userRole} />}
            {view === "trash" && userRole === "penjual" && <Trash token={token} />}
          </div>
        </main>


        <footer className="mt-4 pt-3 text-center">
          <p className={`small ${darkMode ? 'text-light-50' : 'text-muted'}`}>
            © {new Date().getFullYear()} E-Commerce App - Kelompok 27
          </p>
        </footer>
      </div>
    </div>
  );
}
