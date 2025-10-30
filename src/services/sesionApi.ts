// src/services/sesionApi.ts

// La URL base de tu API. Ajústala si es diferente.
const API_URL = "http://localhost:3000/api";

// Definimos una interfaz para los datos que enviaremos al crear una sesión
interface CreateSesionData {
  tiempo_foco: number;
  fecha_hora_creacion: string; // ISO string de la fecha
  duracion: number;
  categoria: number; // El ID de la categoría como número
}

interface UpdateSesionData {
  duracion: number;
}

//  Nueva interfaz para la respuesta de la API al actualizar
interface UpdateApiResponse {
  message: string;
}

/**
 * Función para crear una nueva sesión en la base de datos.
 * @param data - Los datos de la sesión a crear.
 * @param token - El token de autenticación del usuario.
 * @returns La sesión creada.
 */
export const createSesion = async (data: CreateSesionData, token: string) => {
  const response = await fetch(`${API_URL}/sessions`, { // Asegúrate que la ruta sea correcta
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Incluimos el token para las rutas protegidas
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    // Si la respuesta no es exitosa, lanzamos un error para poder capturarlo
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al crear la sesión');
  }

  return response.json();
};

/**
 * Actualiza una sesión existente, específicamente la duración.
 * @param sessionId - El ID de la sesión a actualizar.
 * @param data - Los datos a actualizar (ej: { duracion: 100 }).
 * @param token - El token de autenticación del usuario.
 * @returns La respuesta del servidor.
 */
export const updateSesion = async (sessionId: number, data: UpdateSesionData, token: string): Promise<UpdateApiResponse> => {
  const response = await fetch(`${API_URL}/sessions/${sessionId}`, { // URL con el ID
    method: 'PUT', // Usamos el método PUT como en tu backend
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al actualizar la sesión');
  }

  return response.json();
};