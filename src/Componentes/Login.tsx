import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css'

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Email: ${email}\nPassword: ${password}`);
    navigate("/"); // luego lo reemplazás por la lógica real
  };

  return (
    <div className="LoginPage">
      <div className="LoginBox">
        <h2>Iniciar sesión</h2>

        <form onSubmit={handleSubmit} className="w-full">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="LoginInput"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="LoginInput"
            required
          />

          <button type="submit" className="LoginButton">
            Entrar
          </button>
        </form>
        <button
          onClick={() => navigate("/Registro")}
          className="LoginBack"
        >
          ¿No tenés cuenta? Crear una
        </button>

        <button onClick={() => navigate("/")} className="LoginBack">
          ← Volver al inicio
        </button>
      </div>
    </div>
  );
}

export default Login;
