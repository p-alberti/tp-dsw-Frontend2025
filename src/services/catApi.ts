import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

//estructura de la categoria
interface CategoriaData {
  nombre_categoria: string;
  descripcion: string;
  color: string;
}

//funcion get de las categorias del usuario
export const getMyCategorias = async (token: string) => {
    const response = await axios.get(`${API_URL}/categories/mis-categorias`, {
        headers: { // se pasa el token para validar el usuario
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

// funcion para crear categoria
export const createCategoria = async (categoriaData: CategoriaData, token: string) => {
    const response = await axios.post(`${API_URL}/categories`, categoriaData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};