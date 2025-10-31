import React, { useState, useEffect } from 'react';
import type { TaskData } from '../services/tareaApi.ts';
import './CrearTarea.css';

// Opciones de estado para el desplegable
const ESTADOS_POSIBLES = ['Pendiente', 'En Progreso', 'Completada'];

interface ModalProps {
  onClose: () => void;
  onSave: (data: TaskData) => Promise<void>;
  taskToEdit?: TaskData | null; // si no es null se está editando
}

function CreateTaskModal({ onClose, onSave, taskToEdit }: ModalProps) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState(ESTADOS_POSIBLES[0]); //si no se elige pone el primero
  const [isSaving, setIsSaving] = useState(false);

  // useEffect para rellenar el formulario si estamos en modo edición
  useEffect(() => {
    if (taskToEdit) {
      setNombre(taskToEdit.nombre);
      setDescripcion(taskToEdit.descripcion);
      setEstado(taskToEdit.estado);
    }
  }, [taskToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre) {
      alert('El nombre de la tarea es obligatorio.');
      return;
    }
    setIsSaving(true);
    await onSave({
      nombre,
      descripcion,
      estado,
    });
    // onClose será llamado por el padre
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>×</button>
        <h2>{taskToEdit ? 'Editar Tarea' : 'Crear Nueva Tarea'}</h2>
        <form onSubmit={handleSubmit} className="create-task-form">
          <div className="form-group">
            <label>Nombre</label>
            <input
              className="modal-input"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Descripción</label>
            <textarea
              className="modal-input"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Estado</label>
            <select
              className="modal-input"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
            >
              {ESTADOS_POSIBLES.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="save-button" disabled={isSaving}>
            {isSaving ? 'Guardando...' : 'Guardar Tarea'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateTaskModal;