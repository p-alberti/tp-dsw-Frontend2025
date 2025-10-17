import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import "./BarraSuperior.css";

function BarraSuperior() {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // 3. Obtiene el usuario y la función logout del contexto
  const [isDropdownOpen, setDropdownOpen] = useState(false); // 4. Estado para el menú desplegable

  const handleLogout = () => {
    setDropdownOpen(false); // Cierra el menú
    logout(); // Llama a la función de logout del contexto
  };

  return (
    <header className="BarraSuperior">
      <div className="Logo">
        <h1>Focus<span>Tracker</span></h1>
      </div>

      <nav className="NavDerecha">
        {user ? (
          // Si hay un usuario logueado, muestra este menú:
          <div className="user-menu">
            <button 
              className="BotonLogin" 
              onClick={() => setDropdownOpen(!isDropdownOpen)}
            >
              Hola, {user.nombre}
            </button>
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <button onClick={() => navigate("/historial")}>Historial</button>
                <button onClick={handleLogout}>Cerrar Sesión</button>
              </div>
            )}
          </div>
        ) : (
          // Si NO hay usuario, muestra el botón de siempre:
          <button className="BotonLogin" onClick={() => navigate("/Login")}>
            Log in / Sign up
          </button>
        )}
      </nav>
    </header>
  );
}

export default BarraSuperior;

/*      <button className="BotonLogin" onClick={() => navigate("/Login")}>
        Log in / Sign up
      </button>
      */
