import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
// CAMBIAR: Importamos todas las funciones necesarias
import { getMyTasks, createTask, updateTask, deleteTask } from '../services/tareaApi.ts';
import type { TaskData } from '../services/tareaApi.ts';
import './TasksBox.css';
import CreateTaskModal from './CrearTarea.tsx'; // Importa el nuevo modal

interface Task extends TaskData {
  id: number;
}

function TasksBox() {
  const { token } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // AGREGAR: Estados para manejar el modal y la edición
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const response = await getMyTasks(token);
        setTasks(response.data || []);
      } catch (error) {
        console.error("Error al cargar las tareas:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, [token]);

  const handleOpenCreateModal = () => {
    setTaskToEdit(null); // Nos aseguramos de que no haya una tarea para editar
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setTaskToEdit(task); // Pasamos la tarea al estado de edición
    setIsModalOpen(true);
  };

  const handleDelete = async (taskId: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      try {
        if (!token) return;
        await deleteTask(taskId, token);
        // Actualizamos el estado para reflejar el cambio al instante
        setTasks(tasks.filter(task => task.id !== taskId));
      } catch (error) {
        console.error("Error al eliminar la tarea:", error);
        alert("No se pudo eliminar la tarea.");
      }
    }
  };

  const handleSaveTask = async (taskData: TaskData) => {
    try {
      if (!token) return;
      
      if (taskToEdit) {
        // --- Lógica de ACTUALIZACIÓN ---
        const response = await updateTask(taskToEdit.id, taskData, token);
        setTasks(tasks.map(t => (t.id === taskToEdit.id ? response.data : t)));
      } else {
        // --- Lógica de CREACIÓN ---
        const response = await createTask(taskData, token);
        setTasks([...tasks, response.data]);
      }
      setIsModalOpen(false); // Cerramos el modal en ambos casos
      setTaskToEdit(null);
    } catch (error) {
      console.error("Error al guardar la tarea:", error);
      alert("No se pudo guardar la tarea.");
    }
  };

  if (isLoading) {
    return <div className="TasksBox">Cargando tareas...</div>;
  }

return (
  <>
      <div className="TasksBox">
        <div className="tasks-header">
          <h2>Mis Tareas</h2>
           <button className="create-task-btn" onClick={handleOpenCreateModal}>
            + Crear Tarea
          </button>
        </div>
        <div className="tasks-table-container">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length > 0 ? (
                tasks.map(task => (
                  <tr key={task.id}>
                    <td>{task.nombre}</td>
                    <td>{task.descripcion}</td>
                    <td>
                      <span 
                        className={`status-pill status-${task.estado.toLowerCase().replace(' ', '-')}`}>{task.estado}
                      </span>
                    </td>
                    <td className="actions">
                        <button onClick={() => handleOpenEditModal(task)}>✏️</button>
                        <button onClick={() => handleDelete(task.id)}>🗑️</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4}>¡No tienes tareas! Crea una para empezar.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* {isCreating && <CreateTaskModal onClose={() => setIsCreating(false)} onSave={handleSaveTask} />} */}
      </div>
      
    {isModalOpen && (
      <CreateTaskModal 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
      />
    )}
  </>
  );
}

export default TasksBox;