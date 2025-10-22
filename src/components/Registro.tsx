import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authApi.ts";
import { AxiosError } from "axios";
import "./Registro.css";

interface FormData {
  nombre: string;
  apellido: string;
  fechaNac: string;
  username: string;
  mail: string;
  contraseña: string;
}

function Registro() {
  const navigate = useNavigate();
  // Usamos un único estado para todo el formulario, es más limpio
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    apellido: "",
    fechaNac: "",
    username: "",
    mail: "",
    contraseña: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Llamamos a la función del servicio con todos los datos del formulario
      await registerUser(formData);
      
      // Si todo sale bien, mostramos un mensaje y redirigimos al login
      alert(`¡Registro exitoso para ${formData.nombre}! Ahora puedes iniciar sesión.`);
      navigate("/Login");

    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message || "Ocurrió un error al registrar.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="RegisterPage">
      <div className="RegisterBox">
        <h2>Crear cuenta</h2>

        <form onSubmit={handleSubmit} className="w-full">
          <input type="text" placeholder="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} className="RegisterInput" required />
          <input type="text" placeholder="Apellido" name="apellido" value={formData.apellido} onChange={handleChange} className="RegisterInput" required />
          <input type="date" placeholder="Fecha de Nacimiento" name="fechaNac" value={formData.fechaNac} onChange={handleChange} className="RegisterInput" required />
          <input type="text" placeholder="Nombre de usuario" name="username" value={formData.username} onChange={handleChange} className="RegisterInput" required />
          <input type="email" placeholder="Correo electrónico" name="mail" value={formData.mail} onChange={handleChange} className="RegisterInput" required />
          <input type="password" placeholder="Contraseña" name="contraseña" value={formData.contraseña} onChange={handleChange} className="RegisterInput" required />

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button type="submit" className="RegisterButton" disabled={loading}>
            {loading ? "Registrando..." : "Registrarme"}
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
