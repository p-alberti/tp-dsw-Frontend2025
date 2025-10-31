import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import "./BarraSuperior.css";


function BarraSuperior() {
  const navigate = useNavigate();
  const { usuario, logout } = useAuth(); // obtiene el usuario y la función logout del contexto
  const [isDropdownOpen, setDropdownOpen] = useState(false); //estado para el menú desplegable

  const handleLogout = () => {
    setDropdownOpen(false); // cierra el menú desplegable
    logout(); //llama a la función de logout del contexto
  };

  console.log('usuario: ', usuario)
  return (
    <header className="BarraSuperior">
      <div className="Logo">
        <h1>Focus<span>Tracker</span></h1>
      </div>

      <nav className="NavDerecha">
        {usuario ? (
          //render condicional - si hay usuario muestra el menu
          <div className="user-menu">
            <button 
              className="BotonLogin" 
              onClick={() => setDropdownOpen(!isDropdownOpen)}
            >
              Hola, {usuario.nombre}
            </button>
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <button onClick={() => navigate("/Perfil")}>Perfil</button>
                <button onClick={() => navigate("/estadisticas")}>Ver estadísticas</button>
                <button onClick={handleLogout}>Cerrar Sesión</button>
              </div>
            )}
          </div>
        ) : (
          //si no hay usuario - muestra el boton
          <button className="BotonLogin" onClick={() => navigate("/Login")}>
            Log in / Sign up
          </button>
        )}
      </nav>
    </header>
  );
}

export default BarraSuperior;


