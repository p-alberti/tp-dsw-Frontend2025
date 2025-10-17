import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.tsx";
import { loginUser } from "../services/authApi.ts";
import {AxiosError} from "axios";
import { useNavigate } from "react-router-dom";
import './Login.css'

function Login() {
  const [mail, setMail] = useState('');
  const [contrasena, setContrasena] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await loginUser(mail, contrasena);
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user));
      login(data.token, data.user);
      console.log('Login exitoso!', data);
      navigate('/');
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message || 'Email o contraseña incorrectos.';
            setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="LoginPage">
      <div className="LoginBox">
        <h2>Iniciar sesión</h2>

        <form onSubmit={handleSubmit} className="w-full">

          <input
            type="mail"
            placeholder="Correo electrónico"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            className="LoginInput"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            className="LoginInput"
            required
          />

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <button type="submit" className="LoginButton">
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <button onClick={() => navigate('/Registro')} className="LoginBack">
          ¿No tenés cuenta? Crear una
        </button>

        <button onClick={() => navigate('/')} className="LoginBack">
          ← Volver al inicio
        </button>
      </div>
    </div>
  );
}

export default Login;
