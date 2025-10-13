import React from "react";
import { Routes, Route } from "react-router-dom";
import MainPage from "./Componentes/MainPage.tsx";
import Login from "./Componentes/Login.tsx";
import Registro from "./Componentes/Registro.tsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/Login" element={<Login />} /> 
      <Route path="/Registro" element={<Registro />} />
    </Routes>
  );
}

export default App;
