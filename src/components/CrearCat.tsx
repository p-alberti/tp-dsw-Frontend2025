import React, { useState } from 'react';
import './CrearCat.css';

// Definimos la data que el modal enviará al padre
interface CategoriaData {
  nombre_categoria: string;
  descripcion: string;
  color: string;
}

// Definimos las props que el componente recibirá
interface ModalProps {
  onClose: () => void; // Función para cerrar el modal
  onSave: (data: CategoriaData) => Promise<void>; // Función para guardar
}

function CreateCategoryModal({ onClose, onSave }: ModalProps) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [color, setColor] = useState('#0f4335'); // Un color por defecto
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre) {
      alert('El nombre de la categoría es obligatorio.');
      return;
    }
    setIsSaving(true);
    await onSave({
      nombre_categoria: nombre,
      descripcion,
      color,
    });
    // El 'onClose' se llamará desde el componente padre después de guardar
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>×</button>
        <h2>Crear Nueva Categoría</h2>
        <form onSubmit={handleSubmit} className="create-category-form">
          <div className="form-group">
            <label>Nombre de la Categoría</label>
            <input
              className="modal-input" // CAMBIAR: Usaremos una clase común
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Trabajo profundo, Estudio..."
              required
            />
          </div>
          <div className="form-group">
            <label>Descripción (Opcional)</label>
            <textarea
              className="modal-input" // CAMBIAR: Usaremos una clase común
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Una breve descripción de la categoría"
            />
          </div>
          <div className="form-group">
            <label>Color representativo</label>
            {/* AGREGAR: Un div para estilizar mejor el input de color */}
            <div className="color-input-wrapper">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="color-input"
              />
            </div>
          </div>
          <button type="submit" className="save-button" disabled={isSaving}>
            {isSaving ? 'Guardando...' : 'Guardar Categoría'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateCategoryModal;