// src/context/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Definimos la forma de los datos del usuario que guardamos
interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  username: string;
  mail: string;
  fechaNac: string; // como string para JSON
  categorias?: Categoria[];
}

interface Categoria {
  id: number;
  nombre: string;
}

// Definimos lo que nuestro contexto va a proveer
interface AuthContextType {
    usuario: Usuario | null;
    token: string | null;
    login: (token: string, userData: Usuario) => void;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

// Creamos el contexto con un valor por defecto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Creamos el "Proveedor" del contexto. Este es el componente que envolverá nuestra app
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [usuario, setUser] = useState<Usuario | null>(null);
    const [token, setToken] = useState<string | null>(null);

    // Este efecto se ejecuta solo una vez cuando la app carga
    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        const storedUserData = localStorage.getItem('userData');

        if (storedToken && storedUserData) {
            setToken(storedToken);
            setUser(JSON.parse(storedUserData));
        }
    }, []);

    const login = (newToken: string, userData: Usuario) => {
        // 1. Actualiza el estado del contexto
        setToken(newToken);
        setUser(userData);
        // 2. Guarda los datos en localStorage
        localStorage.setItem('authToken', newToken);
        localStorage.setItem('userData', JSON.stringify(userData));
    };

    const logout = () => {
        // Limpia el estado y el localStorage
        setUser(null);
        setToken(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        // Opcional: redirigir al login
        window.location.href = '/Login';
    };
    
    const refreshUser = async () => {
    if (!usuario || !token) return;

    try {
      const res = await fetch(`http://localhost:3000/api/usuarios/${usuario.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        }
    } catch (error) {
        console.error('Error actualizando usuario:', error);
    }
    };

    return (
        <AuthContext.Provider value={{ usuario, token, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};


// Creamos un "custom hook" para consumir el contexto fácilmente
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};