import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {Link as RouterLink} from "react-router-dom"
import "./Perfil.css";

interface Categoria {
  id: number;
  nombre: string;
}

interface UsuarioDetalle {
  id: number;
  nombre: string;
  apellido: string;
  username: string;
  mail: string;
  fechaNac: string;
  categorias: Categoria[];
}

function Perfil() {
  const { token, refreshUser} = useAuth();
  const [usuario, setUsuario] = useState<UsuarioDetalle | null>(null);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/users/perfil/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUsuario(data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsuario();
  }, [token]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/users/perfil/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(usuario),
      });

      if (res.ok){
        setMensaje("✅ Perfil actualizado con éxito");
        await refreshUser();
      } 
      else setMensaje("❌ Error al actualizar perfil");
    } catch (err) {
      console.error(err);
      setMensaje("⚠️ Error de conexión");
    }
  };

  if (!usuario) return <p>Cargando perfil...</p>;

  return (
    <div className="layout-container">

      <header className="BarraSuperior">
        <div className="Logo">
          <h1>Focus<span>Tracker</span></h1>
        </div>
      </header>

      <main className="perfil-page">
        <RouterLink to="/" className="perfil-back-link">
          « Volver al Inicio
        </RouterLink>

        <div className="perfil-box">
          <h2>Perfil de {usuario.nombre}</h2>

          <form onSubmit={handleSave} className="perfil-form">
            <div className="form-group">
              <label>Nombre:</label>
              <input
                type="text"
                value={usuario.nombre}
                onChange={(e) => setUsuario({ ...usuario, nombre: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Apellido:</label>
              <input
                type="text"
                value={usuario.apellido}
                onChange={(e) => setUsuario({ ...usuario, apellido: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Usuario:</label>
              <input
                type="text"
                value={usuario.username}
                onChange={(e) => setUsuario({ ...usuario, username: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={usuario.mail}
                onChange={(e) => setUsuario({ ...usuario, mail: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Fecha de nacimiento:</label>
              <input
                type="date"
                value={usuario.fechaNac.slice(0, 10)} // formateamos a yyyy-mm-dd
                onChange={(e) => setUsuario({ ...usuario, fechaNac: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Categorías asociadas</label>
              <div className="categorias-box"> {/* <-- AGREGAR: Un contenedor para la lista */}
                {usuario.categorias && usuario.categorias.length > 0 ? (
                  <ul> {/* La lista ahora va aquí adentro */}
                    {usuario.categorias.map((cat) => (
                      <li key={cat.id}>{cat.nombre}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No tiene categorías asignadas</p>
                )}
              </div>
            </div>

            <button type="submit">Guardar cambios</button>
          </form>

          {mensaje && <p className="perfil-mensaje">{mensaje}</p>}
        </div>
      </main>
    </div>
  );
}

export default Perfil;
