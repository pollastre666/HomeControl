import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, db } from '../../config/firebase';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const toastTimestamps = new Map();
const TOAST_DEBOUNCE_MS = 5000;

const showToast = (message, type = 'warn') => {
  const now = Date.now();
  const lastShown = toastTimestamps.get(message) || 0;
  if (now - lastShown > TOAST_DEBOUNCE_MS) {
    toast[type](message);
    toastTimestamps.set(message, now);
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth) {
      console.error('Firebase auth is not initialized');
      setIsLoading(false);
      showToast('Error de autenticación: Firebase no está inicializado', 'error');
      return;
    }

    console.log('Setting up Firebase auth listener...');
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          console.log('Firebase user authenticated:', {
            email: firebaseUser.email,
            uid: firebaseUser.uid,
          });
          let role = 'user';
          try {
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
              role = userDoc.data().role || 'user';
              console.log('User role fetched from Firestore:', role);
            } else {
              console.warn('User document does not exist in Firestore:', firebaseUser.uid);
              try {
                await setDoc(userDocRef, {
                  role: 'user',
                  email: firebaseUser.email,
                  createdAt: new Date(),
                }).catch((createError) => {
                  throw createError;
                });
                console.log('User document created successfully for UID:', firebaseUser.uid);
                showToast('Se creó un nuevo perfil de usuario con rol por defecto: user', 'info');
              } catch (createError) {
                console.error('Error creating user document in Firestore:', {
                  message: createError.message,
                  code: createError.code,
                  details: createError.details,
                });
                showToast(`Error al crear el perfil de usuario: ${createError.message}`, 'error');
                role = 'user'; // Fallback role
              }
            }
          } catch (error) {
            console.error('Error fetching user role from Firestore:', {
              message: error.message,
              code: error.code,
              details: error.details,
            });
            if (error.message.includes('offline')) {
              showToast('No se puede acceder a Firestore: estás offline. Usando rol por defecto: user');
            } else {
              showToast(`Error al obtener el rol del usuario: ${error.message}`, 'error');
            }
            role = 'user'; // Fallback role
          }

          const mappedUser = {
            username: firebaseUser.email.split('@')[0],
            role: role || 'user', // Ensure role is never undefined
            email: firebaseUser.email,
            uid: firebaseUser.uid,
          };
          console.log('User data set:', mappedUser);
          setUser(mappedUser);
        } else {
          console.log('No Firebase user authenticated');
          setUser(null);
        }
      } catch (error) {
        console.error('Error processing auth state:', error);
        showToast('Error al procesar autenticación', 'error');
      } finally {
        setIsLoading(false);
      }
    }, (error) => {
      console.error('Firebase auth error:', error);
      showToast('Error de autenticación de Firebase', 'error');
      setIsLoading(false);
    });

    return () => {
      console.log('Cleaning up Firebase auth listener');
      unsubscribe();
    };
  }, [navigate]);

  const login = async (credentials) => {
    if (!auth) {
      showToast('Firebase no está inicializado', 'error');
      throw new Error('Firebase auth is not initialized');
    }

    if (!credentials?.email || !credentials?.password) {
      showToast('Correo y contraseña son requeridos', 'error');
      throw new Error('Email and password are required');
    }

    console.log('Attempting Firebase login with:', credentials.email);
    try {
      const { email, password } = credentials;
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      console.log('Firebase login successful:', firebaseUser.email);

      let role = 'user';
      try {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          role = userDoc.data().role || 'user';
          console.log('User role fetched from Firestore:', role);
        } else {
          console.warn('User document does not exist in Firestore:', firebaseUser.uid);
          try {
            await setDoc(userDocRef, {
              role: 'user',
              email: firebaseUser.email,
              createdAt: new Date(),
            }).catch((createError) => {
              throw createError;
            });
            console.log('User document created successfully for UID:', firebaseUser.uid);
            showToast('Se creó un nuevo perfil de usuario con rol por defecto: user', 'info');
          } catch (createError) {
            console.error('Error creating user document in Firestore:', {
              message: createError.message,
              code: createError.code,
              details: createError.details,
            });
            showToast(`Error al crear el perfil de usuario: ${createError.message}`, 'error');
            role = 'user'; // Fallback role
          }
        }
      } catch (error) {
        console.error('Error fetching user role from Firestore:', {
          message: error.message,
          code: error.code,
          details: error.details,
        });
        if (error.message.includes('offline')) {
          showToast('No se puede acceder a Firestore: estás offline. Usando rol por defecto: user');
        } else {
          showToast(`Error al obtener el rol del usuario: ${error.message}`, 'error');
        }
        role = 'user'; // Fallback role
      }

      const mappedUser = {
        username: firebaseUser.email.split('@')[0],
        role: role || 'user', // Ensure role is never undefined
        email: firebaseUser.email,
        uid: firebaseUser.uid,
      };

      setUser(mappedUser);
      showToast('Inicio de sesión exitoso', 'success');
      const redirectPath = '/dashboard';
      navigate(redirectPath, { replace: true });
      return { success: true, user: mappedUser };
    } catch (error) {
      console.error('Firebase login error:', error.code, error.message);
      throw error;
    }
  };

  const logout = async () => {
    if (!auth) {
      showToast('Firebase no está inicializado', 'error');
      throw new Error('Firebase auth is not initialized');
    }

    console.log('Attempting Firebase logout');
    try {
      await signOut(auth);
      console.log('Firebase logout successful');
      setUser(null);
      showToast('Cierre de sesión exitoso', 'success');
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Firebase logout error:', error);
      showToast('Error al cerrar sesión', 'error');
      throw error;
    }
  };

  const createUser = async (email, password, role = 'user') => {
    if (!auth) {
      showToast('Firebase no está inicializado', 'error');
      throw new Error('Firebase auth is not initialized');
    }

    if (!email || !password) {
      showToast('Correo y contraseña son requeridos', 'error');
      throw new Error('Email and password are required');
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      console.log('Firebase user created successfully:', firebaseUser.email);

      const userDocRef = doc(db, 'users', firebaseUser.uid);
      await setDoc(userDocRef, {
        role,
        email: firebaseUser.email,
        createdAt: new Date(),
      }).catch((createError) => {
        throw createError;
      });
      console.log('User document created successfully for UID:', firebaseUser.uid);
      showToast(`Usuario creado con rol: ${role}`, 'success');
      return firebaseUser;
    } catch (error) {
      console.error('Error creating user:', {
        message: error.message,
        code: error.code,
        details: error.details,
      });
      showToast(`Error al crear usuario: ${error.message}`, 'error');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, createUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};