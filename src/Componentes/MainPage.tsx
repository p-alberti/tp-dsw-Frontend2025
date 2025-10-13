import React from "react";
import { useNavigate } from "react-router-dom";
import BarraSuperior from "./BarraSuperior.tsx";
import FocusBox from "./FocusBox.tsx";
import SessionBox from "./SessionBox.tsx";
import "./MainPage.css";

function MainPage() {
  const navigate = useNavigate();

  return (
    <div className="MainPage">
      <BarraSuperior />

      <div className="ContenidoPrincipal">
        <SessionBox />
        <FocusBox />
      </div>

      <button
        className="BotonEstadisticas"
        onClick={() => navigate("/estadisticas")}
      >
        Ver estadísticas
      </button>
    </div>
  );
}

export default MainPage;