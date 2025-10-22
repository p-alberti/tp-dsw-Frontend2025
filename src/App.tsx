import React from "react";
import { Routes, Route } from "react-router-dom";
import MainPage from "./components/MainPage.tsx";
import Login from "./components/Login.tsx";
import Registro from "./components/Registro.tsx";
import Perfil from "./components/Perfil.tsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/Login" element={<Login />} /> 
      <Route path="/Registro" element={<Registro />} />
      <Route path="/Perfil" element={<Perfil />} />
    </Routes>
  );
}

export default App;
