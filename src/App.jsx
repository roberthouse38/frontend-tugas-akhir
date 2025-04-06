import React, { useState, useEffect } from "react";
import Cart from "./components/Cart";
import Orders from "./components/Orders";
import OrderDetail from "./components/OrderDetail";
import Login from "./components/Login";
import Register from "./components/Register";
import Products from "./components/Products"; 
import { jwtDecode } from "jwt-decode";

export default function App() {
  const [view, setView] = useState("cart");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userRole, setUserRole] = useState(null);

  // Ambil role dari token saat login
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
      <div className="max-w-md mx-auto p-4">

        <h1 className="text-2xl font-bold mb-4 text-center">Silakan Masuk</h1>

        <div className="flex justify-center gap-4 mb-4">
          <button className="btn" onClick={() => setView("login")}>Login</button>
          <button className="btn" onClick={() => setView("register")}>Register</button>
        </div>

        {view === "login" && <Login onLogin={(token) => {
          setToken(token);
          localStorage.setItem("token", token);
          setView("cart");
        }} />}
        {view === "register" && <Register onRegister={() => setView("login")} />}
      </div>
    );
  }

  // Jika sudah login 
  return (

    //Jadi Header Dulu
    <div className="max-w-xl mx-auto p-4">
      
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-center">E-Commerce UI</h1>
        <h5 className="text-2xl text-center">Tugas Akhir Praktikum SBD Kelompok 27</h5>
        <button className="text-red-500 underline" onClick={handleLogout}>Logout</button>
      </div>

      <div className="flex justify-center gap-4 mb-4">
        {userRole === "pembeli" && ( 
            <>
                <button className="btn" onClick={() => setView("cart")}>Keranjang</button>
                <button className="btn" onClick={() => setView("orders")}>Pesanan</button>
            </>
        )}
        <button className="btn" onClick={() => setView("products")}>Produk</button>
      </div>




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

      {view === "orders" && selectedOrder && (
        <OrderDetail
            token={token}
            orderId={selectedOrder}
            onBack={() => setSelectedOrder(null)}/>
   )}

    </div>
  );
}
