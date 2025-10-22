import React from "react";
import BarraSuperior from "./BarraSuperior.tsx";
import FocusBox from "./FocusBox.tsx";
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
    </div>
  );
}

export default MainPage;