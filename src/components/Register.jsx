import React, { useState } from "react";
import axios from "axios";

export default function Register({ onRegister, goToLogin, darkMode }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("pembeli");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

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
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        onRegister();
      }, 2000);
      
    } catch (err) {
      setError("Registrasi gagal. Coba lagi atau cek email.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="alert alert-danger py-2" role="alert">
          {error}
        </div>
      )}
      
      {success && (
        <div className="alert alert-success py-2" role="alert">
          {success}
        </div>
      )}
      
      <form onSubmit={handleRegister}>
        <div className="form-floating mb-3">
          <input
            type="text"
            className={`form-control ${darkMode ? 'bg-dark text-light border-secondary' : ''}`}
            id="nameInput"
            placeholder="Nama Lengkap"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <label htmlFor="nameInput" className={darkMode ? 'text-light' : ''}>Nama Lengkap</label>
        </div>
        
        <div className="form-floating mb-3">
          <input
            type="email"
            className={`form-control ${darkMode ? 'bg-dark text-light border-secondary' : ''}`}
            id="emailInput"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="emailInput" className={darkMode ? 'text-light' : ''}>Email</label>
        </div>
        
        <div className="form-floating mb-3">
          <input
            type="password"
            className={`form-control ${darkMode ? 'bg-dark text-light border-secondary' : ''}`}
            id="passwordInput"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label htmlFor="passwordInput" className={darkMode ? 'text-light' : ''}>Password</label>
        </div>
        
        <div className="form-floating mb-4">
          <select
            className={`form-select ${darkMode ? 'bg-dark text-light border-secondary' : ''}`}
            id="roleSelect"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="pembeli">Pembeli</option>
            <option value="penjual">Penjual</option>
          </select>
          <label htmlFor="roleSelect" className={darkMode ? 'text-light' : ''}>Daftar Sebagai</label>
        </div>
        
        <div className="d-grid">
          <button 
            type="submit" 
            className="btn btn-success py-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Memproses...
              </>
            ) : "Daftar"}
          </button>
        </div>
      </form>
    </div>
  );
}