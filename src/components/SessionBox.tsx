import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.tsx";
import CreateCategoryModal from "./CrearCat.tsx";
// AGREGAR: Importamos las nuevas funciones de nuestro servicio de API
import { getMyCategorias, createCategoria } from "../services/catApi.ts";
import "./SessionBox.css";

interface Categoria {
  id: number;
  nombre_categoria: string;
  color: string;
}

interface SessionBoxProps {
  selectedCategoriaId: string;
  onCategoriaChange: (categoria: Categoria | null) => void;
}

function SessionBox({ selectedCategoriaId, onCategoriaChange}: SessionBoxProps) {
  const { token } = useAuth();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  // useEffect ahora usa nuestro nuevo servicio
  useEffect(() => {
    const fetchCategorias = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        // CAMBIAR: Usamos la función del servicio en lugar de fetch
        const responseData = await getMyCategorias(token);
        setCategorias(responseData.data || []);
      } catch (error) {
        console.error("Error al cargar categorías:", error);
        // Opcional: Mostrar un mensaje de error al usuario
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategorias();
  }, [token]);

  // handleSaveNewCategory ahora usa nuestro nuevo servicio
  const handleSaveNewCategory = async (data: { nombre_categoria: string; descripcion: string; color: string; }) => {
    if (!token) return alert("Debes estar logueado para crear una categoría.");
    
    try {
      // CAMBIAR: Usamos la función del servicio en lugar de fetch
      const nuevaCategoriaData = await createCategoria(data, token);
      setCategorias([...categorias, nuevaCategoriaData.data]);
      onCategoriaChange(nuevaCategoriaData.data);
      setIsCreating(false);
    } catch (error) {
      console.error("Error al crear la categoría:", error);
      alert("No se pudo crear la categoría. Intenta de nuevo.");
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoriaId = e.target.value;
    if (!categoriaId) {
      onCategoriaChange(null);
    } else {
      // Buscamos el objeto completo y lo pasamos al padre
      const categoriaSeleccionada = categorias.find(cat => cat.id.toString() === categoriaId);
      onCategoriaChange(categoriaSeleccionada || null);
    }
  };

  return (
    <>
      <div className="SessionBox">
        <h2>Seleccionar Categoría</h2>
        <select
          className="SelectorSesion"
          value={selectedCategoriaId}
          onChange={handleSelectChange}
          disabled={isLoading || categorias.length === 0}
        >
          {isLoading ? (
            <option>Cargando...</option>
          ) : categorias.length > 0 ? (
            <>
              <option value="">-- Elegí una Categoría --</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre_categoria}
                </option>
              ))}
            </>
          ) : (
            <option>Crea tu primera categoría</option>
          )}
        </select>

        <div className="BotonesSesion">
          <button className="BotonSesion" onClick={() => setIsCreating(true)}>
            Crear nueva
          </button>
        </div>
      </div>

      {isCreating && (
        <CreateCategoryModal 
          onClose={() => setIsCreating(false)} 
          onSave={handleSaveNewCategory} 
        />
      )}
    </>
  );
}

export default SessionBox;