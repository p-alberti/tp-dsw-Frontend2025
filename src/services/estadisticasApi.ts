import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// El periodo puede ser '1-semana', '1-mes', etc.
export const getStatisticsData = async (periodo: string, token: string) => {
    const response = await axios.get(`${API_URL}/estadisticas`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { periodo } // axios lo convierte a ?periodo=...
    });
    console.log("Datos de estadísticas recibidos:", response.data);
    return response.data;
};