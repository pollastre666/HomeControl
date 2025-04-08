import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un usuario autenticado al cargar la app
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await mockAuthApi(credentials);
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// Mock API (en producción, reemplaza con tu API real)
const mockAuthApi = (credentials) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.usuario && credentials.contrasena) {
        const role = credentials.usuario === 'admin' ? 'admin' : 
                    credentials.usuario === 'editor' ? 'editor' : 'user';
        resolve({
          success: true,
          user: { username: credentials.usuario, role }
        });
      } else {
        reject(new Error('Credenciales inválidas'));
      }
    }, 1000);
  });
};