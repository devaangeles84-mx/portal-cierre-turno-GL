import React, { useState } from "react";
import { loginUser } from "../services/api";

export default function Login({ onLogin }) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await loginUser({ usuario, password });
      onLogin(result.session);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-brand">
          <img src="/gl2.png" alt="La Grúa" />
          <strong>
            Grúas <span>Laguna</span>
          </strong>
        </div>
        <div className="login-hero">
          <h1>Cierre de Turno</h1>
          <p>Ingresa para capturar o revisar cierres por oficina.</p>
        </div>
        <form className="login-form" onSubmit={submit}>
          <label>
            Usuario
            <input value={usuario} onChange={(event) => setUsuario(event.target.value)} autoComplete="username" />
          </label>
          <label>
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="primary" disabled={loading}>
            {loading ? "Validando" : "Entrar"}
          </button>
        </form>
      </section>
    </main>
  );
}
