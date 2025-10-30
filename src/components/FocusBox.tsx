import React, { useState, useEffect, useMemo } from "react";
import './FocusBox.css';
import RelojInteractivo from "./RelojInteractivo";
import SessionBox from "./SessionBox";
import { createSesion, updateSesion } from "../services/sesionApi.ts"; 
import { useAuth } from "../context/AuthContext.tsx";

// Definimos la estructura de nuestros relojes para la configuración
const CONFIGURACION_RELOJES = {
  foco: { titulo: "Tiempo de Foco", tipo: "principal" as const },
  corto: { titulo: "Recreo Corto", tipo: "secundario" as const },
  largo: { titulo: "Recreo Largo", tipo: "secundario" as const },
};

// ¡LA CLAVE DE LA ESCALABILIDAD! Defines el ciclo como una lista de claves.
// Puedes reordenarlo, repetirlo, etc., y la lógica funcionará.

function FocusBox() {
  const { token } = useAuth();
  // Estado para los TIEMPOS CONFIGURADOS por el usuario
  const [tiempos, setTiempos] = useState({
    foco: { min: 25, seg: 0, iteraciones: 4 }, // Pongamos 4 por defecto, un Pomodoro estándar
    corto: { min: 5, seg: 0, iteraciones: 1 },
    largo: { min: 10, seg: 0, iteraciones: 1 },
  });

  const cicloDinamico = useMemo(() => {
  const nuevoCiclo: (keyof typeof CONFIGURACION_RELOJES)[] = [];

  const totalFocos = Math.max(1, tiempos.foco.iteraciones);         // Cuántos ciclos de foco hay
  const cortosPorLargo = Math.max(1, tiempos.corto.iteraciones);    // Cada cuántos recreos cortos hay un largo

  let contadorCortos = 0;

  for (let i = 0; i < totalFocos; i++) {
    nuevoCiclo.push("foco"); // Siempre va primero un tiempo de foco

    // Si no es el último foco, siempre viene un recreo
    if (i < totalFocos - 1) {
      contadorCortos++;

      if (contadorCortos <= cortosPorLargo) {
        nuevoCiclo.push("corto");
      } else {
        nuevoCiclo.push("largo");
        contadorCortos = 0; // Se resetea después de un recreo largo
      }
    }
  }

  console.log("🧩 Ciclo generado:", nuevoCiclo);
  return nuevoCiclo;
  }, [tiempos.foco.iteraciones, tiempos.corto.iteraciones]);


  // Estado del TEMPORIZADOR
  const [pasoActual, setPasoActual] = useState(0); // Índice del array CICLO_POMODORO
  const [tiempoRestante, setTiempoRestante] = useState(tiempos.foco.min * 60 + tiempos.foco.seg);
  const [estaActivo, setEstaActivo] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState<string>('');
  const [mensajeError, setMensajeError] = useState<string>('');
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);


  // El motor del temporizador
  useEffect(() => {
    let interval: number | undefined = undefined;

    if (estaActivo && tiempoRestante > 0) {
      interval = setInterval(() => {
        setTiempoRestante((prev) => prev - 1);
      }, 1000);
    } 
    else if (estaActivo && tiempoRestante === 0) {
      const proximoPaso = pasoActual + 1;

      // Si llegamos al final del ciclo (por ejemplo, después de recreo largo)
      if (proximoPaso >= cicloDinamico.length) {

        const finalizarSesion = async () => {
          if (currentSessionId && token) {
            try {
              // Calculamos la duración total del foco en minutos
              const duracionFinal = tiempos.foco.min * tiempos.foco.iteraciones;
              console.log("Duración final calculada:", duracionFinal);
              const updateData = { duracion: duracionFinal };

              // Llamamos a la API para actualizar la sesión
              const response = await updateSesion(currentSessionId, updateData, token);
              console.log('Sesión finalizada y actualizada:', response.message);

            } catch (error) {
              console.error("Error al actualizar la duración de la sesión:", error);
              // Opcional: mostrar un mensaje de error si la actualización falla
            }
          }
        };

        finalizarSesion();
        setCurrentSessionId(null); // Reseteamos el ID de la sesión activa
        setEstaActivo(false); //  Detenemos el temporizador
        setPasoActual(0);     //  Reseteamos el progreso al inicio para la próxima sesión
        //  Reseteamos el tiempo visible al del primer paso (foco)
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
    // Limpieza: se ejecuta cuando el componente se desmonta o el estado cambia
    return () => clearInterval(interval);
  }, [estaActivo, tiempoRestante, pasoActual, tiempos, cicloDinamico, currentSessionId, token]);

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
      categoria: parseInt(selectedCategoria, 10),
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
    setEstaActivo(prev => !prev); // Simplemente alterna el estado activo
  };

  const handleStop = async () => {
    // Si por alguna razón no hay sesión activa, simplemente resetea la UI
    if (!currentSessionId || !token) {
      setEstaActivo(false);
      setPasoActual(0);
      setCurrentSessionId(null);
      setTiempoRestante(tiempos.foco.min * 60 + tiempos.foco.seg);
      return;
    }

    // --- Inicio del Cálculo de Duración Real ---
    let duracionRealMinutos = 0;

    //  Calcular los minutos de los pomodoros de foco completados
    const pomodorosCompletados = cicloDinamico
      .slice(0, pasoActual) // Tomamos todos los pasos ANTERIORES al actual
      .filter(paso => paso === 'foco'); // Filtramos para quedarnos solo con los de foco
    
    duracionRealMinutos += pomodorosCompletados.length * tiempos.foco.min;

    //  Calcular los minutos transcurridos en el pomodoro de foco actual (si aplica)
    const pasoEsDeFoco = cicloDinamico[pasoActual] === 'foco';
    if (pasoEsDeFoco) {
      const tiempoInicialDelPasoSeg = tiempos.foco.min * 60 + tiempos.foco.seg;
      const tiempoTranscurridoSeg = tiempoInicialDelPasoSeg - tiempoRestante;
      // Convertimos segundos a minutos, redondeando hacia arriba (si pasó 1 segundo, cuenta como 1 minuto)
      const minutosTranscurridos = Math.ceil(tiempoTranscurridoSeg / 60);
      duracionRealMinutos += minutosTranscurridos;
    }
    
    console.log(`Deteniendo sesión. Duración real calculada: ${duracionRealMinutos} minutos.`);
    // --- Fin del Cálculo ---

    try {
      //  Llamar a la API para actualizar la sesión con la duración real
      const updateData = { duracion: duracionRealMinutos };
      await updateSesion(currentSessionId, updateData, token);
      console.log('Sesión detenida y duración actualizada en la BD.');

    } catch (error) {
      console.error("Error al actualizar la duración al detener:", error);
      // Opcional: Mostrar un mensaje al usuario si la actualización falla
      // A pesar del error, reseteamos la UI para que el usuario pueda continuar.
    }

    setEstaActivo(false); // Detiene el contador
    setPasoActual(0);     // Resetea el paso al inicio
    setCurrentSessionId(null); // Limpia el ID de la sesión, clave para la lógica de botones
    
    // Resetea el tiempo al valor inicial del foco
    const tiempoInicial = tiempos.foco.min * 60 + tiempos.foco.seg;
    setTiempoRestante(tiempoInicial);
  };
  
  // Lógica para mostrar el tiempo
  const clavePasoActivo = cicloDinamico[pasoActual];
  const displayMinutos = Math.floor(tiempoRestante / 60);
  const displaySegundos = tiempoRestante % 60;

  return (
    <div className="FocusBox">
      <div className="ContenidoFocusBox"> {/* Contenedor Flex para alinear horizontalmente */}
        
        <SessionBox 
          selectedCategoria={selectedCategoria}
          onCategoriaChange={setSelectedCategoria}
        /> {/* Componente de sesión ahora está aquí */}
        
        {/* Agrupamos los relojes y botones en su propio contenedor para alinearlos verticalmente */}
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
              // Estado inicial: No hay sesión activa, solo se muestra "Iniciar"
              <button className="BotonAccion" onClick={handleStartNewSession}>
                Iniciar
              </button>
            ) : (
              // Estado activo: Hay una sesión (corriendo o pausada)
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