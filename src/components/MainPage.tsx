import React from "react";
import BarraSuperior from "./BarraSuperior.tsx";
import FocusBox from "./FocusBox.tsx";
import "./MainPage.css";

function MainPage() {

  return (
    <div className="MainPage">
      <BarraSuperior />
      <div className="ContenidoPrincipal">
        <FocusBox />
      </div>
    </div>
  );
}

export default MainPage;