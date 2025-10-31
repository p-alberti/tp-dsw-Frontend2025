import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

//como guardamos al usuario
interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  username: string;
  mail: string;
  fechaNac: string; 
  categorias?: Categoria[];
}

interface Categoria {
  id: number;
  nombre: string;
}

interface AuthContextType {
    usuario: Usuario | null;
    token: string | null;
    login: (token: string, userData: Usuario) => void;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

//proveedor de contexto - envuelve la app
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [usuario, setUser] = useState<Usuario | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        const storedUserData = localStorage.getItem('userData');

        if (storedToken && storedUserData) {
            const parsed = JSON.parse(storedUserData);
            setToken(storedToken);
            setUser(parsed.data ? parsed.data : parsed);
        }
    }, []);

    const login = (newToken: string, userData: Usuario) => {
        // actualiza el estado del contexto
        setToken(newToken);
        setUser(userData);
        // guarda los datos en localStorage
        localStorage.setItem('authToken', newToken);
        localStorage.setItem('userData', JSON.stringify(userData));
    };

    const logout = () => {
        //limpia el estado y el localStorage
        setUser(null);
        setToken(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.href = '/Login';
    };
    
    const refreshUser = async () => {
    if (!usuario || !token) return;

    try {
      const res = await fetch(`http://localhost:3000/api/users/${usuario.id}`, {
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


// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};