import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Interfaz para los datos de una tarea
export interface TaskData {
  nombre: string;
  descripcion: string;
  estado: string;
}

// 1. Obtener las tareas del usuario logueado
export const getMyTasks = async (token: string) => {
    const response = await axios.get(`${API_URL}/tasks/mis-tareas`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// 2. Crear una nueva tarea para el usuario
export const createTask = async (taskData: TaskData, token: string) => {
    const response = await axios.post(`${API_URL}/tasks`, taskData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// 3. (Opcional pero recomendado) Actualizar una tarea
export const updateTask = async (id: number, taskData: Partial<TaskData>, token: string) => {
    const response = await axios.put(`${API_URL}/tasks/${id}`, taskData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// 4. (Opcional pero recomendado) Eliminar una tarea
export const deleteTask = async (id: number, token: string) => {
    const response = await axios.delete(`${API_URL}/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};