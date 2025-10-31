

import axios from 'axios';

const API_URL = 'http://localhost:3000/api'; //variabilizamos la ruta


export const loginUser = async (mail: string, contraseña: string) => {
    
    const response = await axios.post(`${API_URL}/auth/login`, { //peticion con axios enviando en el segundo arg los datos que el back necesita
        mail: mail,
        contraseña: contraseña,
    });
    
    // response.data tendra los datos y el token del usuario
    return response.data;
};


// funcion de registro
export const registerUser = async (userData: any) => { // peticion para crear el usuario
    const response = await axios.post(`${API_URL}/users`, userData);
    
    return response.data;
};