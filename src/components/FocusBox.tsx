import React, { useState, useEffect, useMemo } from "react";
import './FocusBox.css';
import RelojInteractivo from "./RelojInteractivo";
import SessionBox from "./SessionBox";

// Definimos la estructura de nuestros relojes para la configuración
const CONFIGURACION_RELOJES = {
  foco: { titulo: "Tiempo de Foco", tipo: "principal" as const },
  corto: { titulo: "Recreo Corto", tipo: "secundario" as const },
  largo: { titulo: "Recreo Largo", tipo: "secundario" as const },
};

// ¡LA CLAVE DE LA ESCALABILIDAD! Defines el ciclo como una lista de claves.
// Puedes reordenarlo, repetirlo, etc., y la lógica funcionará.
const PLANTILLA_CICLO: (keyof typeof CONFIGURACION_RELOJES)[] = ['foco', 'corto', 'foco', 'largo'];

function FocusBox() {
  // Estado para los TIEMPOS CONFIGURADOS por el usuario
  const [tiempos, setTiempos] = useState({
    foco: { min: 25, seg: 0, iteraciones: 4 }, // Pongamos 4 por defecto, un Pomodoro estándar
    corto: { min: 5, seg: 0, iteraciones: 1 },
    largo: { min: 10, seg: 0, iteraciones: 1 },
  });

  const cicloDinamico = useMemo(() => {
    const nuevoCiclo: (keyof typeof CONFIGURACION_RELOJES)[] = [];
    // Usamos el contador de 'foco' como el número de sesiones por ciclo completo.
    const sesionesDeFoco = Math.max(1, tiempos.foco.iteraciones);

    for (let i = 0; i < sesionesDeFoco; i++) {
      // 1. Añade una sesión de Foco.
      nuevoCiclo.push('foco');

      // 2. Comprueba si es la última sesión de foco del ciclo.
      if (i === sesionesDeFoco - 1) {
        // Si es la última, añade un Recreo Largo.
        nuevoCiclo.push('largo');
      } else {
        // Si no es la última, añade un Recreo Corto.
        nuevoCiclo.push('corto');
      }
    }
    
    return nuevoCiclo;
  }, [tiempos.foco.iteraciones]); // La dependencia ahora es SOLO el contador de foco. ¡Mucho más eficiente!

  // Estado del TEMPORIZADOR
  const [pasoActual, setPasoActual] = useState(0); // Índice del array CICLO_POMODORO
  const [tiempoRestante, setTiempoRestante] = useState(tiempos.foco.min * 60 + tiempos.foco.seg);
  const [estaActivo, setEstaActivo] = useState(false);

  // El motor del temporizador
  useEffect(() => {
    let interval: number | undefined = undefined;

    if (estaActivo && tiempoRestante > 0) {
      interval = setInterval(() => {
        setTiempoRestante((prev) => prev - 1);
      }, 1000);
    } 
    else if (estaActivo && tiempoRestante === 0) {
      // Fin del paso, pasar al siguiente
      const proximoPaso = (pasoActual + 1) % cicloDinamico.length;
      setPasoActual(proximoPaso);

      const claveProximoPaso = cicloDinamico[proximoPaso];
      const tiempoProximoPaso = tiempos[claveProximoPaso];
      setTiempoRestante(tiempoProximoPaso.min * 60 + tiempoProximoPaso.seg);
      
      // Opcional: Sonido de notificación
      // new Audio('/ruta/a/sonido.mp3').play();
    }

    // Limpieza: se ejecuta cuando el componente se desmonta o el estado cambia
    return () => clearInterval(interval);
  }, [estaActivo, tiempoRestante, pasoActual, tiempos, cicloDinamico]);

  // Función que los relojes hijos llamarán para actualizar la configuración
const handleTiempoChange = (clave: keyof typeof tiempos, unidad: 'minutos' | 'segundos', cantidad: number) => {
  setTiempos(prev => {
    const tiempoActual = prev[clave];
    let nuevosMin = tiempoActual.min;
    let nuevosSeg = tiempoActual.seg;

    if (unidad === 'minutos') {
      nuevosMin = Math.max(0, Math.min(99, tiempoActual.min + cantidad));
    } else {
      nuevosSeg = Math.max(0, Math.min(59, tiempoActual.seg + cantidad));
    }
    
    // LA SOLUCIÓN ESTÁ AQUÍ
    const nuevosTiempos = { 
      ...prev, // Copia todos los relojes (foco, corto, largo)
      [clave]: { 
        ...prev[clave], // DENTRO del reloj que modificamos, copia sus propiedades antiguas (¡incluyendo iteraciones!)
        min: nuevosMin, // Y LUEGO sobrescribe solo los minutos y segundos
        seg: nuevosSeg 
      } 
    };

    // Si el reloj modificado es el actual y no está activo, actualizamos el tiempo restante
    if (clave === cicloDinamico[pasoActual] && !estaActivo) {
      setTiempoRestante(nuevosMin * 60 + nuevosSeg);
    }

    return nuevosTiempos;
  });
};

  const handleIteracionesChange = (clave: keyof typeof tiempos, newCount: number) => {
  setTiempos(prev => ({
    ...prev,
    [clave]: { ...prev[clave], iteraciones: newCount }
  }));
  };

  const handleStartStop = () => {
    if (!estaActivo) {
      // Al iniciar, nos aseguramos de que el tiempo restante sea el del paso actual
      const clavePasoActual = cicloDinamico[pasoActual];
      const tiempoPasoActual = tiempos[clavePasoActual];
      setTiempoRestante(tiempoPasoActual.min * 60 + tiempoPasoActual.seg);
    }
    setEstaActivo(!estaActivo);
  };
  
  // Lógica para mostrar el tiempo
  const clavePasoActivo = cicloDinamico[pasoActual];
  const displayMinutos = Math.floor(tiempoRestante / 60);
  const displaySegundos = tiempoRestante % 60;

  return (
    <div className="FocusBox">
      <div className="ContenidoFocusBox"> {/* Contenedor Flex para alinear horizontalmente */}
        
        <SessionBox /> {/* Componente de sesión ahora está aquí */}
        
        {/* Agrupamos los relojes y botones en su propio contenedor para alinearlos verticalmente */}
        <div className="ContenedorTimers">
          <RelojInteractivo
            titulo={CONFIGURACION_RELOJES.foco.titulo}
            tipo={CONFIGURACION_RELOJES.foco.tipo}
            minutos={estaActivo && clavePasoActivo === 'foco' ? displayMinutos : tiempos.foco.min}
            segundos={estaActivo && clavePasoActivo === 'foco' ? displaySegundos : tiempos.foco.seg}
            estaActivo={estaActivo && clavePasoActivo === 'foco'}
            estaDeshabilitado={estaActivo}
            onTiempoChange={(u, c) => handleTiempoChange('foco', u, c)}
            iteraciones={tiempos.foco.iteraciones}
            onIteracionesChange={(count) => handleIteracionesChange('foco', count)}
          />
          
          <div className="RelojesSecundariosContainer">
            <RelojInteractivo
              titulo={CONFIGURACION_RELOJES.corto.titulo}
              tipo={CONFIGURACION_RELOJES.corto.tipo}
              minutos={estaActivo && clavePasoActivo === 'corto' ? displayMinutos : tiempos.corto.min}
              segundos={estaActivo && clavePasoActivo === 'corto' ? displaySegundos : tiempos.corto.seg}
              estaActivo={estaActivo && clavePasoActivo === 'corto'}
              estaDeshabilitado={estaActivo}
              onTiempoChange={(u, c) => handleTiempoChange('corto', u, c)}
              iteraciones={tiempos.corto.iteraciones}
              onIteracionesChange={(count) => handleIteracionesChange('corto', count)}
            />
            <RelojInteractivo
              titulo={CONFIGURACION_RELOJES.largo.titulo}
              tipo={CONFIGURACION_RELOJES.largo.tipo}
              minutos={estaActivo && clavePasoActivo === 'largo' ? displayMinutos : tiempos.largo.min}
              segundos={estaActivo && clavePasoActivo === 'largo' ? displaySegundos : tiempos.largo.seg}
              estaActivo={estaActivo && clavePasoActivo === 'largo'}
              estaDeshabilitado={estaActivo}
              onTiempoChange={(u, c) => handleTiempoChange('largo', u, c)}
              iteraciones={tiempos.largo.iteraciones}
              onIteracionesChange={(count) => handleIteracionesChange('largo', count)}
            />
          </div>

          <div className="BotonesContainer">
            <button className="BotonAccion" onClick={handleStartStop}>
              {estaActivo ? 'Pausar' : 'Iniciar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FocusBox;