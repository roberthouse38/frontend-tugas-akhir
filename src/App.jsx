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
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-100 to-blue-200 px-4 py-10">
        <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
          <h1 className="text-3xl font-extrabold text-center text-blue-600 mb-6">Selamat Datang</h1>

          <div className="flex justify-center gap-4 mb-6">
            <button
              className={`px-4 py-2 rounded-lg font-medium border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition duration-300 ${view === "login" && "bg-blue-500 text-white"}`}
              onClick={() => setView("login")}
            >
              Login
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-medium border border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition duration-300 ${view === "register" && "bg-green-500 text-white"}`}
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
      </div>
    );
  }

  // Jika sudah login
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4 py-8">
      <header className="max-w-2xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-bold text-indigo-700">🛒 E-Commerce UI</h1>
        <p className="text-sm text-gray-500">Tugas Akhir Praktikum SBD - Kelompok 27</p>
        <button
          className="mt-2 text-red-500 hover:underline text-sm"
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      <nav className="max-w-2xl mx-auto flex justify-center gap-3 mb-6">
        {userRole === "pembeli" && (
          <>
            <button
              className={`px-4 py-2 rounded-lg font-medium transition duration-300 ${
                view === "cart"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-100"
              }`}
              onClick={() => setView("cart")}
            >
              Keranjang
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-medium transition duration-300 ${
                view === "orders"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-100"
              }`}
              onClick={() => setView("orders")}
            >
              Pesanan
            </button>
          </>
        )}

        <button
          className={`px-4 py-2 rounded-lg font-medium transition duration-300 ${
            view === "products"
              ? "bg-indigo-600 text-white"
              : "bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-100"
          }`}
          onClick={() => setView("products")}
        >
          Produk
        </button>
      </nav>

      <main className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-xl transition-all duration-300">
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
