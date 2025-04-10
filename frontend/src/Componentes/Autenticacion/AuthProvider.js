import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../../config/firebase'; // Ajusta la ruta según tu estructura
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Escuchar cambios en el estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Mapear los datos de Firebase al formato que usas
        const mappedUser = {
          username: firebaseUser.email.split('@')[0], // Ejemplo: extraer username del email
          role: firebaseUser.email === 'admin@example.com' ? 'admin' : 
                firebaseUser.email === 'editor@example.com' ? 'editor' : 'user', // Lógica de roles
          email: firebaseUser.email,
          uid: firebaseUser.uid,
        };
        setUser(mappedUser);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    // Limpiar la suscripción al desmontar
    return () => unsubscribe();
  }, []);

  const login = async (credentials) => {
    try {
      const { usuario, contrasena } = credentials;
      const email = `${usuario}@example.com`; // Adaptar según tu lógica de emails
      const userCredential = await signInWithEmailAndPassword(auth, email, contrasena);
      const firebaseUser = userCredential.user;

      const mappedUser = {
        username: usuario,
        role: usuario === 'admin' ? 'admin' : usuario === 'editor' ? 'editor' : 'user',
        email: firebaseUser.email,
        uid: firebaseUser.uid,
      };

      setUser(mappedUser);
      return { success: true, user: mappedUser };
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);