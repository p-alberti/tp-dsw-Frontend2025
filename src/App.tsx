import React from "react";
import { Routes, Route } from "react-router-dom";
import MainPage from "./components/MainPage.tsx";
import Login from "./components/Login.tsx";
import Registro from "./components/Registro.tsx";
import Perfil from "./components/Perfil.tsx";
import Estadisticas from "./components/Estadisticas.tsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/Login" element={<Login />} /> 
      <Route path="/Registro" element={<Registro />} />
      <Route path="/Perfil" element={<Perfil />} />
      <Route path="/Estadisticas" element={<Estadisticas />} />
    </Routes>
  );
}

export default App;
