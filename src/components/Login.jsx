import React, { useState } from "react";
import axios from "axios";

export default function Login({ onLogin, goToRegister }) {
    const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        email,
        password,
      });

      const token = response.data.token;
      localStorage.setItem("token", token);
      onLogin(token);
    } catch (err) {
      setError("Login gagal. Cek email/password.");
    }
  };

  return (
    <div className="max-w-sm mx-auto p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="text"
          placeholder="email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Login
        </button>
      </form>
      <p className="mt-4 text-sm text-center">
        Belum punya akun?{" "}
        <button onClick={goToRegister} className="text-blue-600 hover:underline">
          Daftar
        </button>
      </p>
    </div>
  );
}
