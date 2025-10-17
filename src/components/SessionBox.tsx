import React, { useState } from "react";
import "./SessionBox.css";

function SessionBox() {
  // Estado para guardar la sesión seleccionada
  const [selectedSession, setSelectedSession] = useState<string>("");

  // Ejemplo de sesiones predefinidas
  const sesiones = ["Trabajo profundo", "Estudio", "Lectura", "Descanso"];

  const handleApply = () => {
    if (selectedSession) {
      alert(`Sesión aplicada: ${selectedSession}`);
    } else {
      alert("Selecciona un tipo de sesión primero.");
    }
  };

  const handleCreateNew = () => {
    const nuevaSesion = prompt("Nombre de la nueva sesión:");
    if (nuevaSesion) {
      alert(`Nueva sesión creada: ${nuevaSesion}`);
      // Más adelante podrías guardar esto en backend o estado global
    }
  };

  return (
    <div className="SessionBox">
      <h2>Seleccionar sesión</h2>
      <select
        className="SelectorSesion"
        value={selectedSession}
        onChange={(e) => setSelectedSession(e.target.value)}
      >
        <option value="">-- Elegí una sesión --</option>
        {sesiones.map((s, i) => (
          <option key={i} value={s}>
            {s}
          </option>
        ))}
      </select>

      <div className="BotonesSesion">
        <button className="BotonSesion" onClick={handleApply}>
          Aplicar
        </button>
        <button className="BotonSesion" onClick={handleCreateNew}>
          Crear nueva
        </button>
      </div>
    </div>
  );
}

export default SessionBox;
