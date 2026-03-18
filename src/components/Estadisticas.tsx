import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {Link as RouterLink} from "react-router-dom"
import BarraSuperior from "./BarraSuperior.tsx";
import { getStatisticsData } from "../services/estadisticasApi.ts";
import "./Estadisticas.css";

// --- Interfaces para los datos que recibiremos de la API ---
interface FocoPorCategoria {
    nombre: string;
    color: string;
    duracion: number;
}

interface StatsData {
    tiempoTotalFoco: number;
    tareasCompletadas: number;
    focoPorCategoria: FocoPorCategoria[];
}


function Estadisticas() {
  const { token } = useAuth();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [periodo, setPeriodo] = useState('1-semana'); // Estado para el filtro

  useEffect(() => {
      const fetchStats = async () => {
        if (!token) return;
          try {
            setIsLoading(true);
            const data = await getStatisticsData(periodo, token);
            setStats(data);
          } catch (error) {
            console.error("Error al cargar estadísticas:", error);
          } finally {
            setIsLoading(false);
          }
      };
      fetchStats();
  }, [token, periodo]); // Se vuelve a ejecutar si cambia el token O el periodo

  const formatearMinutos = (min: number) => {
      const horas = Math.floor(min / 60);
      const minutos = min % 60;
      return `${horas}h ${minutos}m`;
  };

  return (
    <div className="layout-container-stats">
            <BarraSuperior />
            <RouterLink to="/" className="perfil-back-link">
              « Volver al Inicio
            </RouterLink>
            <main className="stats-page">
                <header className="stats-header">
                    <h2>Tus Estadísticas</h2>
                    <div className="filtro-tiempo">
                        <label htmlFor="periodo">Mostrar:</label>
                        <select id="periodo" value={periodo} onChange={e => setPeriodo(e.target.value)}>
                            <option value="1-semana">Última semana</option>
                            <option value="1-quincena">Últimos 15 días</option>
                            <option value="1-mes">Último mes</option>
                            <option value="1-trimestre">Último trimestre</option>
                            <option value="medio-ano">Últimos 6 meses</option>
                            <option value="1-ano">Último año</option>
                        </select>
                    </div>
                </header>

                {isLoading ? (
                    <p>Cargando estadísticas...</p>
                ) : !stats ? (
                    <p>No hay datos disponibles para mostrar.</p>
                ) : (
                    <div className="stats-grid">
                        {/* Tarjetas de Resumen */}
                        <div className="stat-card">
                            <h3>Tiempo Total de Foco</h3>
                            <p className="big-number">{formatearMinutos(stats.tiempoTotalFoco)}</p>
                        </div>
                        <div className="stat-card">
                            <h3>Tareas Completadas</h3>
                            <p className="big-number">{stats.tareasCompletadas}</p>
                        </div>
                        
                        {/* Tabla de Foco por Categoría */}
                        <div className="stat-card full-width">
                            <h3>Foco por Categoría</h3>
                            <ul className="category-stats-list">
                                {stats.focoPorCategoria.map(cat => {
                                    const proporcion = stats.tiempoTotalFoco > 0 ? (cat.duracion / stats.tiempoTotalFoco) * 100 : 0;
                                    return (
                                        <li key={cat.nombre}>
                                            <div className="category-info">
                                                <span className="color-dot" style={{ backgroundColor: cat.color }}></span>
                                                <span className="category-name">{cat.nombre}</span>
                                                <span className="category-time">{formatearMinutos(cat.duracion)}</span>
                                            </div>
                                            <div className="progress-bar-container">
                                                <div className="progress-bar" style={{ width: `${proporcion.toFixed(1)}%`, backgroundColor: cat.color }}></div>
                                                <span className="proportion-text">{proporcion.toFixed(1)}%</span>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Estadisticas;