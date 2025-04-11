import React, { useState } from "react";
import axios from "axios";

export default function Login({ onLogin, goToRegister, darkMode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

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
      
      <form onSubmit={handleLogin}>
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
        
        <div className="form-floating mb-4">
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
        
        <div className="d-grid">
          <button 
            type="submit" 
            className="btn btn-primary py-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Memproses...
              </>
            ) : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
}