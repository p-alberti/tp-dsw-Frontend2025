
const API_URL = "http://localhost:3000/api";

// estructura de la sesión
interface CreateSesionData {
  tiempo_foco: number;
  fecha_hora_creacion: string; 
  duracion: number;
  categoria: number;
}

interface UpdateSesionData {
  duracion: number;
}

interface UpdateApiResponse {
  message: string;
}

//funcion para crear la sesion
export const createSesion = async (data: CreateSesionData, token: string) => {
  const response = await fetch(`${API_URL}/sessions`, { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al crear la sesión');
  }

  return response.json();
};

export const updateSesion = async (sessionId: number, data: UpdateSesionData, token: string): Promise<UpdateApiResponse> => {
  const response = await fetch(`${API_URL}/sessions/${sessionId}`, { 
    method: 'PUT', 
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