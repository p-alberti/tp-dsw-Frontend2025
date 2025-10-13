import React from "react";
import "./BarraSuperior.css";

function BarraSuperior() {
  return (
    <header className="BarraSuperior">
      <div className="Logo">
        <h1>Focus<span>Tracker</span></h1>
      </div>

      <nav className="NavDerecha">
        <button className="BotonLogin">Log in / Sign up</button>
      </nav>
    </header>
  );
}

export default BarraSuperior;
