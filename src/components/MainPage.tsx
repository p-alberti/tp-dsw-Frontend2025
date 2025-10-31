import React from "react";
import BarraSuperior from "./BarraSuperior.tsx";
import FocusBox from "./FocusBox.tsx";
import TasksBox from "./TasksBox.tsx";
import "./MainPage.css";

function MainPage() {

  return (
    <div className="MainPage">
      <BarraSuperior />
      <div className="ContenidoPrincipal">
        <FocusBox />
        <TasksBox />
      </div>
    </div>
  );
}

export default MainPage;