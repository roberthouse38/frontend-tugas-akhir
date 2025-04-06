import React, { useState } from "react";
import Cart from "./components/Cart";
import Orders from "./components/Orders";
import OrderDetail from "./components/OrderDetail";
import Login from "./components/Login";
import Register from "./components/Register";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [view, setView] = useState("cart");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [authPage, setAuthPage] = useState("login"); // "login" or "register"

  if (!token) {
    return authPage === "login" ? (
      <Login onLogin={setToken} goToRegister={() => setAuthPage("register")} />
    ) : (
      <Register goToLogin={() => setAuthPage("login")} />
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">E-Commerce UI</h1>
      <div className="flex justify-center gap-4 mb-4">
        <button onClick={() => setView("cart")}>Keranjang</button>
        <button onClick={() => setView("orders")}>Pesanan</button>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            setToken("");
            setAuthPage("login");
          }}
        >
          Logout
        </button>
      </div>

      {view === "cart" && <Cart token={token} />}
      {view === "orders" && <Orders token={token} onSelectOrder={setSelectedOrder} />}
      {selectedOrder && (
        <OrderDetail token={token} orderId={selectedOrder} onBack={() => setSelectedOrder(null)} />
      )}
    </div>
  );
}
