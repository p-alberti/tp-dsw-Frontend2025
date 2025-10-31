import React, { useState, useEffect, useMemo } from "react";
import './FocusBox.css';
import RelojInteractivo from "./RelojInteractivo";
import SessionBox from "./SessionBox";
import { createSesion, updateSesion } from "../services/sesionApi.ts"; 
import { useAuth } from "../context/AuthContext.tsx";

//estructura de nuestros relojes para la configuración
const CONFIGURACION_RELOJES = {
  foco: { titulo: "Tiempo de Foco", tipo: "principal" as const },
  corto: { titulo: "Recreo Corto", tipo: "secundario" as const },
  largo: { titulo: "Recreo Largo", tipo: "secundario" as const },
};

interface Categoria {
  id: number;
  nombre_categoria: string;
  color: string;
}

function FocusBox() {
  const { token } = useAuth();
  // estado para los tiempos config por el usuario
  const [tiempos, setTiempos] = useState({
    foco: { min: 25, seg: 0, iteraciones: 4 },
    corto: { min: 5, seg: 0, iteraciones: 1 },
    largo: { min: 10, seg: 0, iteraciones: 1 },
  });

  const cicloDinamico = useMemo(() => {
  const nuevoCiclo: (keyof typeof CONFIGURACION_RELOJES)[] = [];

  const totalFocos = Math.max(1, tiempos.foco.iteraciones); // cuantos ciclos de foco hay
  const cortosPorLargo = Math.max(1, tiempos.corto.iteraciones);    // cada cuantos recreos cortos hay uno largo

  let contadorCortos = 0;

  for (let i = 0; i < totalFocos; i++) {
    nuevoCiclo.push("foco");

    // si no es el último foco siempre viene un recreo
    if (i < totalFocos - 1) {
      contadorCortos++;

      if (contadorCortos <= cortosPorLargo) {
        nuevoCiclo.push("corto");
      } else {
        nuevoCiclo.push("largo");
        contadorCortos = 0; //reset después de un recreo largo
      }
    }
  }

  console.log("Ciclo generado:", nuevoCiclo);
  return nuevoCiclo;
  }, [tiempos.foco.iteraciones, tiempos.corto.iteraciones]);


  // Estado del temporizador
  const [pasoActual, setPasoActual] = useState(0); // indice del array ciclo_pomodoro
  const [tiempoRestante, setTiempoRestante] = useState(tiempos.foco.min * 60 + tiempos.foco.seg);
  const [estaActivo, setEstaActivo] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(null);
  const [mensajeError, setMensajeError] = useState<string>('');
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);

  useEffect(() => {
    let interval: number | undefined = undefined;

    if (estaActivo && tiempoRestante > 0) {
      interval = setInterval(() => {
        setTiempoRestante((prev) => prev - 1);
      }, 1000);
    } 
    else if (estaActivo && tiempoRestante === 0) {
      const proximoPaso = pasoActual + 1;

      //cuando termina el ciclo
      if (proximoPaso >= cicloDinamico.length) {

        const finalizarSesion = async () => {
          if (currentSessionId && token) {
            try {
              //duración total del foco en minutos
              const duracionFinal = tiempos.foco.min * tiempos.foco.iteraciones;
              console.log("Duración final calculada:", duracionFinal);
              const updateData = { duracion: duracionFinal };

              //call a la api para actualizar la sesion
              const response = await updateSesion(currentSessionId, updateData, token);
              console.log('Sesión finalizada y actualizada:', response.message);

            } catch (error) {
              console.error("Error al actualizar la duración de la sesión:", error);
            }
          }
        };

        finalizarSesion();
        setCurrentSessionId(null); //reset id de sesion 
        setEstaActivo(false); //parar reloj
        setPasoActual(0);     //reset progreso del ciclo
        const clavePrimerPaso = cicloDinamico[0];
        const tiempoPrimerPaso = tiempos[clavePrimerPaso];
        setTiempoRestante(tiempoPrimerPaso.min * 60 + tiempoPrimerPaso.seg);
        new Audio('/sonido_final.mp3').play()
      } else {
        new Audio('/sonido_cambio.mp3').play()
        setPasoActual(proximoPaso);

        const claveProximoPaso = cicloDinamico[proximoPaso];
        const tiempoProximoPaso = tiempos[claveProximoPaso];
        setTiempoRestante(tiempoProximoPaso.min * 60 + tiempoProximoPaso.seg);
      }      
    }
    return () => clearInterval(interval); // limpia 
  }, [estaActivo, tiempoRestante, pasoActual, tiempos, cicloDinamico, currentSessionId, token]);

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
    
    const nuevosTiempos = { 
      ...prev, // copia todos los relojes
      [clave]: { 
        ...prev[clave], // copia props antiguas del reloj modificado
        min: nuevosMin, //solo sobrescribe minutos y segundos
        seg: nuevosSeg 
      } 
    };

    // actualiza el reloj si no está activo
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

  const handleStartNewSession = async () => {
    if (!selectedCategoria) {
      setMensajeError('Por favor, selecciona una categoría para comenzar.');
      setTimeout(() => setMensajeError(''), 3000);
      return;
    }

    setMensajeError('');
    const sesionData = {
      tiempo_foco: tiempos.foco.min,
      fecha_hora_creacion: new Date().toISOString(),
      duracion: 0,
      categoria: selectedCategoria.id,
    };

    try {
      if (!token) throw new Error("No estás autenticado.");
      
      const nuevaSesion = await createSesion(sesionData, token);
      console.log('Sesión creada exitosamente:', nuevaSesion.data);

      setCurrentSessionId(nuevaSesion.data.id);
      
      const clavePasoActual = cicloDinamico[pasoActual];
      const tiempoPasoActual = tiempos[clavePasoActual];
      setTiempoRestante(tiempoPasoActual.min * 60 + tiempoPasoActual.seg);
      setEstaActivo(true);

    } catch (error) {
      console.error("Error al iniciar la sesión:", error);
      setMensajeError('No se pudo crear la sesión. Inténtalo de nuevo.');
      setTimeout(() => setMensajeError(''), 4000);
    }
  };

  const handlePlayPause = () => {
    setEstaActivo(prev => !prev);
  };

  const handleStop = async () => {
    // reset a la interfaz de usuario
    if (!currentSessionId || !token) {
      setEstaActivo(false);
      setPasoActual(0);
      setCurrentSessionId(null);
      setTiempoRestante(tiempos.foco.min * 60 + tiempos.foco.seg);
      return;
    }

    // --- Calculo de duración real ---
    let duracionRealMinutos = 0;

    //calcula minutos en base a los focos completados
    const pomodorosCompletados = cicloDinamico
      .slice(0, pasoActual)             // me quedo con todos los pasos anteriores al actual
      .filter(paso => paso === 'foco'); // y solo con los focos
    
    duracionRealMinutos += pomodorosCompletados.length * tiempos.foco.min;

    //agrego los minutos transcurridos en el paso actual
    const pasoEsDeFoco = cicloDinamico[pasoActual] === 'foco';
    if (pasoEsDeFoco) {
      const tiempoInicialDelPasoSeg = tiempos.foco.min * 60 + tiempos.foco.seg;
      const tiempoTranscurridoSeg = tiempoInicialDelPasoSeg - tiempoRestante;

      const minutosTranscurridos = Math.ceil(tiempoTranscurridoSeg / 60); //redondeo hacia arriba 
      duracionRealMinutos += minutosTranscurridos;
    }
    
    console.log(`Deteniendo sesión. Duración real calculada: ${duracionRealMinutos} minutos.`);


    try {
      //call a la api para actualizar la duración
      const updateData = { duracion: duracionRealMinutos };
      await updateSesion(currentSessionId, updateData, token);
      console.log('Sesión detenida y duración actualizada en la BD.');

    } catch (error) {
      console.error("Error al actualizar la duración al detener:", error);
    }

    setEstaActivo(false); //para el reloj
    setPasoActual(0);     //reset de pasos
    setCurrentSessionId(null); //resetea la sesión instanciada
    
    // reset al valor inicial del foco
    const tiempoInicial = tiempos.foco.min * 60 + tiempos.foco.seg;
    setTiempoRestante(tiempoInicial);
  };
  
  
  const clavePasoActivo = cicloDinamico[pasoActual];
  const displayMinutos = Math.floor(tiempoRestante / 60);
  const displaySegundos = tiempoRestante % 60;
  const focusBoxClasses = `FocusBox ${currentSessionId !== null ? 'session-active' : ''}`;

  return (
    <div className={focusBoxClasses}>
      {currentSessionId !== null && selectedCategoria && (
        <div 
          className="CategoriaTag" 
          style={{ backgroundColor: selectedCategoria.color }}
        >
          {selectedCategoria.nombre_categoria}
        </div>
      )}
      <div className="ContenidoFocusBox"> 
        
        {currentSessionId === null && (
          <SessionBox 
            selectedCategoriaId={selectedCategoria?.id.toString() || ''} //se pasa id como string
            onCategoriaChange={setSelectedCategoria}
          />
        )}
        
        <div className="ContenedorTimers">
          <RelojInteractivo
            titulo={CONFIGURACION_RELOJES.foco.titulo}
            tipo={CONFIGURACION_RELOJES.foco.tipo}
            minutos={ clavePasoActivo === 'foco' ? displayMinutos : tiempos.foco.min}
            segundos={ clavePasoActivo === 'foco' ? displaySegundos : tiempos.foco.seg}
            estaActivo={estaActivo && clavePasoActivo === 'foco'}
            estaDeshabilitado={estaActivo && currentSessionId !== null}
            onTiempoChange={(u, c) => handleTiempoChange('foco', u, c)}
            iteraciones={tiempos.foco.iteraciones}
            onIteracionesChange={(count) => handleIteracionesChange('foco', count)}
          />
          
          <div className="RelojesSecundariosContainer">
            <RelojInteractivo
              titulo={CONFIGURACION_RELOJES.corto.titulo}
              tipo={CONFIGURACION_RELOJES.corto.tipo}
              minutos={ clavePasoActivo === 'corto' ? displayMinutos : tiempos.corto.min}
              segundos={ clavePasoActivo === 'corto' ? displaySegundos : tiempos.corto.seg}
              estaActivo={estaActivo && clavePasoActivo === 'corto'}
              estaDeshabilitado={estaActivo && currentSessionId !== null}
              onTiempoChange={(u, c) => handleTiempoChange('corto', u, c)}
              iteraciones={tiempos.corto.iteraciones}
              onIteracionesChange={(count) => handleIteracionesChange('corto', count)}
            />
            <RelojInteractivo
              titulo={CONFIGURACION_RELOJES.largo.titulo}
              tipo={CONFIGURACION_RELOJES.largo.tipo}
              minutos={ clavePasoActivo === 'largo' ? displayMinutos : tiempos.largo.min}
              segundos={ clavePasoActivo === 'largo' ? displaySegundos : tiempos.largo.seg}
              estaActivo={estaActivo && clavePasoActivo === 'largo'}
              estaDeshabilitado={estaActivo && currentSessionId !== null}
              onTiempoChange={(u, c) => handleTiempoChange('largo', u, c)}
              iteraciones={1}
              onIteracionesChange={() => {}}
              iteracionesModificables={false}
            />
          </div>

          <div className="BotonesContainer">
            {currentSessionId === null ? (
              //render condicional - si no hay sesion activa muestra "iniciar"
              <button className="BotonAccion" onClick={handleStartNewSession}>
                Iniciar
              </button>
            ) : (
              // si hay sesion activa - muestra pausa y detener
              <>
                <button className="BotonAccion" onClick={handlePlayPause}>
                  {estaActivo ? 'Pausar' : 'Reanudar'}
                </button>
                <button className="BotonAccion BotonDetener" onClick={handleStop}>
                  Detener
                </button>
              </>
            )}
          </div>
          {mensajeError && <p className="MensajeError">{mensajeError}</p>}
        </div>
      </div>
    </div>
  );
}

export default FocusBox;