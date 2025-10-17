// src/context/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Definimos la forma de los datos del usuario que guardamos
interface User {
    id: number;
    nombre: string;
}

// Definimos lo que nuestro contexto va a proveer
interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, userData: User) => void;
    logout: () => void;
}

// Creamos el contexto con un valor por defecto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Creamos el "Proveedor" del contexto. Este es el componente que envolverá nuestra app
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
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

    const login = (newToken: string, userData: User) => {
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

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
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