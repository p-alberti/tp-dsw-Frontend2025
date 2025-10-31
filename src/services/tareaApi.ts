import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// estructura de las tareas
export interface TaskData {
  nombre: string;
  descripcion: string;
  estado: string;
}

//obtener tareas del usuario
export const getMyTasks = async (token: string) => {
    const response = await axios.get(`${API_URL}/tasks/mis-tareas`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

//funcion para crear tarea
export const createTask = async (taskData: TaskData, token: string) => {
    const response = await axios.post(`${API_URL}/tasks`, taskData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

//funcion para modificar tarea
export const updateTask = async (id: number, taskData: Partial<TaskData>, token: string) => {
    const response = await axios.put(`${API_URL}/tasks/${id}`, taskData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// funcion para eliminar tarea
export const deleteTask = async (id: number, token: string) => {
    const response = await axios.delete(`${API_URL}/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};