import React, { useState } from "react";
import axios from "axios";

export default function Register({ goToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("pembeli"); // default
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await axios.post("http://localhost:3000/auth/register", {
        name,
        email,
        password,
        role,
      });

      setSuccess("Registrasi berhasil! Silakan login.");
      setName("");
      setEmail("");
      setPassword("");
      setRole("pembeli");
    } catch (err) {
      setError("Registrasi gagal. Coba lagi atau cek email.");
    }
  };

  return (
    <div className="max-w-sm mx-auto p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Daftar Akun</h2>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      {success && <p className="text-green-600 text-sm mb-2">{success}</p>}
      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="text"
          placeholder="Nama"
          className="w-full p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
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
        <select
          className="w-full p-2 border rounded"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="pembeli">Pembeli</option>
          <option value="penjual">Penjual</option>
        </select>
        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">
          Daftar
        </button>
      </form>
      <p className="mt-4 text-sm text-center">
        Sudah punya akun?{" "}
        <button onClick={goToLogin} className="text-blue-600 hover:underline">
          Login
        </button>
      </p>
    </div>
  );
}
