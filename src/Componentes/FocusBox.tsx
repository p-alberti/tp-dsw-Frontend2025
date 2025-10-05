import React from "react";
import './FocusBox.css'

function FocusBox() {
    return (
    <div className="FocusBox">
      {/* Este será el espacio para el temporizador en el futuro */}
      <h2 className="TiempoDisplay">25:00</h2>
      
      {/* Un contenedor para los botones para que sea más fácil centrarlos */}
      <div className="BotonesContainer">
        <button className="BotonAccion">Iniciar</button>
        <button className="BotonAccion">Pausar</button>
      </div>
    </div>
    )
}

export default FocusBox;