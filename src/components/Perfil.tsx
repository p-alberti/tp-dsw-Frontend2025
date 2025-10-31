import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {Link as RouterLink} from "react-router-dom"
import "./Perfil.css";

interface Categoria {
  id: number;
  nombre_categoria: string;
  descripcion: string;
  color: string;  
}

interface UsuarioDetalle {
  id: number;
  nombre: string;
  apellido: string;
  username: string;
  mail: string;
  fechaNac: string;
  categorias: Categoria[];
}

function Perfil() {
  const { token, refreshUser} = useAuth();
  const [usuario, setUsuario] = useState<UsuarioDetalle | null>(null);
  const [mensaje, setMensaje] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(null);


  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/users/perfil/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          console.log("Datos del usuario:", data);
          setUsuario(data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsuario();
  }, [token]);

    // Abre el modal y carga la categoría seleccionada
  const handleAbrirModal = (categoria: Categoria) => {
    setCategoriaSeleccionada({ ...categoria });//copia la categoria seleccionada
    setModalVisible(true);
  };

  // cierra el modal y resetea la categoria
  const handleCerrarModal = () => {
    setModalVisible(false);
    setCategoriaSeleccionada(null);
  };
  
  //manejo de inputs en el modal
  const handleCategoriaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (categoriaSeleccionada) {
        setCategoriaSeleccionada({
            ...categoriaSeleccionada,
            [e.target.name]: e.target.value
        });
    }
  };

  //guardado del cambios
  const handleGuardarCategoria = async () => {
    if (!categoriaSeleccionada) return;

    try {
      console.log("ID enviado:", categoriaSeleccionada.id);

      const res = await fetch(`http://localhost:3000/api/categories/${categoriaSeleccionada.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre_categoria: categoriaSeleccionada.nombre_categoria,
          descripcion: categoriaSeleccionada.descripcion,
          color: categoriaSeleccionada.color,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Categoría modificada con éxito:", data);

        // actualizacion
        setUsuario((prevUsuario) => {
          if (!prevUsuario) return prevUsuario;
          const nuevasCategorias = prevUsuario.categorias.map((cat: Categoria) =>
            cat.id === categoriaSeleccionada.id ? data.data : cat
          );
          return { ...prevUsuario, categorias: nuevasCategorias };
        });

        setMensaje("Categoría actualizada con éxito");
        handleCerrarModal();
      } else {
        const errData = await res.json();
        console.error("Error al modificar categoría:", errData);
        setMensaje(`Error al modificar: ${errData.message}`);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      setMensaje("No se pudo conectar con el servidor");
    }
  };

  // eliminacion de categoria
  const handleEliminarCategoria = async () => {
    if (!categoriaSeleccionada) return;
    if (!window.confirm(`¿Estás seguro de eliminar "${categoriaSeleccionada.nombre_categoria}"?`)) return;

    try {
      const res = await fetch(`http://localhost:3000/api/categories/${categoriaSeleccionada.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        console.log("Categoría eliminada correctamente");
        setUsuario((prevUsuario) => {
          if (!prevUsuario) return prevUsuario;
          const nuevasCategorias = prevUsuario.categorias.filter(
            (cat: Categoria) => cat.id !== categoriaSeleccionada.id
          );
          return { ...prevUsuario, categorias: nuevasCategorias };
        });
        setMensaje("Categoría eliminada con éxito");
        handleCerrarModal();
      } else {
        const errData = await res.json();
        console.error("Error al eliminar categoría:", errData);
        setMensaje(`Error al eliminar: ${errData.message}`);
      }
    } catch (error) {
      console.error(" Error de conexión:", error);
      setMensaje("No se pudo conectar con el servidor");
    }
  };


  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { id, categorias, ...usuarioEditable } = usuario;
      console.log("Usuario enviado al back:", usuario);
      console.log("UsuarioEditable enviado al back:", usuarioEditable);
      const res = await fetch("http://localhost:3000/api/users/perfil/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(usuarioEditable),
      });

      if (res.ok){
        setMensaje("Perfil actualizado con éxito");
        await refreshUser();
      } 
      else setMensaje("Error al actualizar perfil");
    } catch (err) {
      console.error(err);
      setMensaje("Error de conexión");
    }
  };

  if (!usuario) return <p>Cargando perfil...</p>;

  return (
    <div className="layout-container">

      <header className="BarraSuperior">
        <div className="Logo">
          <h1>Focus<span>Tracker</span></h1>
        </div>
      </header>

      <main className="perfil-page">
        <RouterLink to="/" className="perfil-back-link">
          « Volver al Inicio
        </RouterLink>

        <div className="perfil-box">
          <h2>Perfil de {usuario.nombre}</h2>

          <form onSubmit={handleSave} className="perfil-form">
            <div className="form-group">
              <label>Nombre:</label>
              <input
                type="text"
                value={usuario.nombre}
                onChange={(e) => setUsuario({ ...usuario, nombre: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Apellido:</label>
              <input
                type="text"
                value={usuario.apellido}
                onChange={(e) => setUsuario({ ...usuario, apellido: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Usuario:</label>
              <input
                type="text"
                value={usuario.username}
                onChange={(e) => setUsuario({ ...usuario, username: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={usuario.mail}
                onChange={(e) => setUsuario({ ...usuario, mail: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Fecha de nacimiento:</label>
              <input
                type="date"
                value={usuario.fechaNac.slice(0, 10)} // formateamos a yyyy-mm-dd
                onChange={(e) => setUsuario({ ...usuario, fechaNac: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Categorías asociadas</label>
              <div className="categorias-box"> 
                {usuario.categorias && usuario.categorias.length > 0 ? (
                  <ul> 
                    {usuario.categorias.map((cat) => (
                      <li key={cat.id} className="categoria-item">
                        <span>{cat.nombre_categoria}</span>
                        <button type="button" onClick={() => handleAbrirModal(cat)} className="edit-category-btn">
                           ✏️ 
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No tiene categorías asignadas</p>
                )}
              </div>
            </div>

            <button type="submit">Guardar cambios</button>
          </form>

          {mensaje && <p className="perfil-mensaje">{mensaje}</p>}
        </div>
      </main>
      {modalVisible && categoriaSeleccionada && (
        <>
            <div className="modal-overlay" onClick={handleCerrarModal}></div>
            <div className="modal-container">
                <div className="modal-header">
                    <h3>Editar Categoría</h3>
                    <button onClick={handleCerrarModal} className="modal-close-btn">&times;</button>
                </div>
                <div className="modal-body">
                    <div className="form-group">
                        <label htmlFor="nombre_categoria">Nombre:</label>
                        <input 
                            type="text" 
                            id="nombre_categoria"
                            name="nombre_categoria"
                            value={categoriaSeleccionada.nombre_categoria}
                            onChange={handleCategoriaChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="descripcion">Descripción:</label>
                        <input 
                            type="text" 
                            id="descripcion"
                            name="descripcion"
                            value={categoriaSeleccionada.descripcion}
                            onChange={handleCategoriaChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="color">Color:</label>
                        <input 
                            type="color" 
                            id="color"
                            name="color"
                            value={categoriaSeleccionada.color}
                            onChange={handleCategoriaChange}
                            className="color-picker"
                        />
                    </div>
                </div>
                <div className="modal-footer">
                    <button onClick={handleGuardarCategoria} className="modal-btn-guardar">Guardar</button>
                    <button onClick={handleEliminarCategoria} className="modal-btn-eliminar">Eliminar</button>
                </div>
            </div>
        </>
      )}
    </div>
  );
}

export default Perfil;
