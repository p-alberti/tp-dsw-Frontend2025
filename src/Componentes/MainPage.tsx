import React from "react";
import BarraSuperior from "./BarraSuperior";
import FocusBox from "./FocusBox";
import SessionBox from "./SessionBox.tsx";
import "./MainPage.css";

function MainPage() {
  return (
    <div className="MainPage">
      <BarraSuperior />

      <div className="ContenidoPrincipal">
        <SessionBox />

        <FocusBox />
      </div>
      
      <button className="BotonEstadisticas">
        Ver estadísticas
      
      </button>
    </div>
  );
}

export default MainPage;
