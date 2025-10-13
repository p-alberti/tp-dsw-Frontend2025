import React from "react";
import { useNavigate } from "react-router-dom";
import "./BarraSuperior.css";

function BarraSuperior() {
  const navigate = useNavigate();

  return (
    <header className="BarraSuperior">
      <div className="Logo">
        <h1>Focus<span>Tracker</span></h1>
      </div>

      <nav className="NavDerecha">
      <button className="BotonLogin" onClick={() => navigate("/Login")}>
        Log in / Sign up
      </button>
      </nav>
    </header>
  );
}

export default BarraSuperior;
