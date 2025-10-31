import React from 'react';
import './RelojInteractivo.css';
import ContadorIter from './ContadorIter.tsx';

interface RelojProps {
  titulo?: string;
  minutos: number; 
  segundos: number; 
  tipo: 'principal' | 'secundario';
  estaActivo: boolean; // prop para saber si  el reloj está corriendo
  estaDeshabilitado: boolean; // prop para deshabilitar los controles
  onTiempoChange: (unidad: 'minutos' | 'segundos', cantidad: number) => void; // Función para notificar al padre del cambio
  iteraciones: number;
  onIteracionesChange: (newCount: number) => void;
  iteracionesModificables?: boolean;
}

function RelojInteractivo({ titulo, minutos, segundos, tipo, estaActivo, estaDeshabilitado, onTiempoChange,  iteraciones, onIteracionesChange, iteracionesModificables = true }: RelojProps) {
  
  const minDecenas = Math.floor(minutos / 10);
  const minUnidades = minutos % 10;
  const segDecenas = Math.floor(segundos / 10);
  const segUnidades = segundos % 10;
  
  // Clases CSS dinámicas para el feedback 
  const wrapperClasses = `RelojWrapper ${tipo} ${estaActivo ? 'activo' : ''}`;

  const DigitColumn = ({ value, unidad, cantidad }) => (
    <div className="DigitColumn">
      <button onClick={() => onTiempoChange(unidad, cantidad)} disabled={estaDeshabilitado}>▲</button>
      <span>{value}</span>
      <button onClick={() => onTiempoChange(unidad, -cantidad)} disabled={estaDeshabilitado}>▼</button>
    </div>
  );

  return (
    <div className={wrapperClasses}>
      {titulo && <h4 className="RelojTitulo">{titulo}</h4>}
      <div className="ContenidoReloj">
        <div className={`RelojInteractivo ${tipo}`}>
          <div className="DigitGroup">
            <DigitColumn value={minDecenas} unidad="minutos" cantidad={10} />
            <DigitColumn value={minUnidades} unidad="minutos" cantidad={1} />
          </div>
          <span className="Separator">:</span>
          <div className="DigitGroup">
            <DigitColumn value={segDecenas} unidad="segundos" cantidad={10} />
            <DigitColumn value={segUnidades} unidad="segundos" cantidad={1} />
          </div>
        </div>
        <ContadorIter
          count={iteraciones}
          onCountChange={onIteracionesChange}
          disabled={estaDeshabilitado}
          isModifiable={iteracionesModificables}
        />
      </div>
    </div>
  );
}

export default RelojInteractivo;