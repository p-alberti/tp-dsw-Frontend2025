

import axios from 'axios';

// 1. Definimos la URL base de tu backend.
// Si alguna vez tu backend cambia de puerto o de dominio, solo lo cambias aquí.
const API_URL = 'http://localhost:3000/api';

// 2. Creamos y exportamos la función para el LOGIN.
// Es una función `async` porque las peticiones a la red toman tiempo.
export const loginUser = async (mail: string, contraseña: string) => {
    
    // Usamos axios para hacer una petición POST al endpoint de login.
    // La URL completa será: http://localhost:3000/api/auth/login
    const response = await axios.post(`${API_URL}/auth/login`, {
        // El segundo argumento de axios.post es el "body" de la petición.
        // Aquí enviamos los datos que el backend espera.
        mail: mail,
        contraseña: contraseña,
    });
    
    // axios envuelve la respuesta del backend en un objeto `data`.
    // Devolvemos `response.data`, que contendrá el token y los datos del usuario.
    return response.data;
};



// 3. Creamos y exportamos la función para el REGISTRO.
export const registerUser = async (userData: any) => { // 'any' por simplicidad, puedes crear una interfaz UserFormData

    // Hacemos una petición POST al endpoint de creación de usuarios.
    // La URL completa será: http://localhost:3000/api/users
    const response = await axios.post(`${API_URL}/users`, userData);
    
    return response.data;
};