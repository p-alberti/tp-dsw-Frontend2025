import axios from 'axios';

// La misma URL base que ya tienes
const API_URL = 'http://localhost:3000/api';

// Definimos una interfaz para los datos de la nueva categoría
interface CategoriaData {
  nombre_categoria: string;
  descripcion: string;
  color: string;
}

// 1. Función para OBTENER las categorías del usuario logueado.
export const getMyCategorias = async (token: string) => {
    // Hacemos una petición GET a la nueva ruta segura.
    // Pasamos el token en los headers para la autenticación.
    const response = await axios.get(`${API_URL}/categories/mis-categorias`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

// 2. Función para CREAR una nueva categoría para el usuario logueado.
export const createCategoria = async (categoriaData: CategoriaData, token: string) => {
    // Hacemos una petición POST a la nueva ruta segura.
    const response = await axios.post(`${API_URL}/categories`, categoriaData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};