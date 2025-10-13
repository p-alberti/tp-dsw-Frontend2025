import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Registro.css";

function Registro() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica de registro (en el futuro)
    alert(`Registro exitoso:\nNombre: ${nombre}\nEmail: ${email}`);
    navigate("/Login"); // vuelve al login tras registrarse
  };

  return (
    <div className="RegisterPage">
      <div className="RegisterBox">
        <h2>Crear cuenta</h2>

        <form onSubmit={handleSubmit} className="w-full">
          <input
            type="text"
            placeholder="Nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="RegisterInput"
            required
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="RegisterInput"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="RegisterInput"
            required
          />

          <button type="submit" className="RegisterButton">
            Registrarme
          </button>
        </form>

        <button onClick={() => navigate("/Login")} className="RegisterBack">
          ← Ya tengo cuenta
        </button>
      </div>
    </div>
  );
}

export default Registro;
