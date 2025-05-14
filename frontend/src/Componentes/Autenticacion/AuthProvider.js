import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import { auth, db } from '../../config/firebase';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  sendEmailVerification
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext();
const toastTimestamps = new Map();
const TOAST_DEBOUNCE_MS = 5000;

const showToast = (message, type = 'warn') => {
  const now = Date.now();
  const lastShown = toastTimestamps.get(message) || 0;
  if (now - lastShown > TOAST_DEBOUNCE_MS) {
    toast[type](message, { autoClose: 3000 });
    toastTimestamps.set(message, now);
  }
};

const fetchOrCreateUserData = async (firebaseUser) => {
  const userDocRef = doc(db, 'users', firebaseUser.uid);
  try {
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        role: data.role || 'user',
        permissions: data.permissions || ['view:profile', 'view:devices'],
        username: data.username || firebaseUser.email.split('@')[0],
        name: data.name || '',
        address: data.address || { street: '', city: '', postalCode: '', country: '' },
        phone: data.phone || '',
        notificationPrefs: data.notificationPrefs || { email: true, sms: false },
        devices: data.devices || [],
        profileIncomplete: data.profileIncomplete ?? true,
        fcmToken: data.fcmToken || '',
      };
    }
    const defaultData = {
      role: 'user',
      permissions: ['view:profile', 'view:devices', 'control:own_devices'],
      email: firebaseUser.email,
      username: firebaseUser.email.split('@')[0],
      name: '',
      address: { street: '', city: '', postalCode: '', country: '' },
      phone: '',
      notificationPrefs: { email: true, sms: false },
      devices: [],
      createdAt: new Date(),
      profileIncomplete: true,
      fcmToken: '',
    };
    await setDoc(userDocRef, defaultData);
    showToast('Por favor, completa tu perfil.', 'info');
    return defaultData;
  } catch (error) {
    console.error('AuthProvider: Firestore error:', error);
    showToast('Error al acceder a datos de usuario', 'error');
    throw error;
  }
};

const checkPermissionAccess = (user, requiredPermissions) => {
  if (!user) return false;
  const userPermissions = user.permissions || [];
  return requiredPermissions.every(perm => userPermissions.includes(perm));
};

const checkDeviceAccess = async (user, deviceId) => {
  if (!user) return false;
  const deviceRef = doc(db, 'devices', deviceId);
  const deviceDoc = await getDoc(deviceRef);
  return deviceDoc.exists() && deviceDoc.data().owner === user.uid;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const hasRedirectedOnce = useRef(false);
  const authListenerInitialized = useRef(false);

  const handleInitialRedirect = useCallback((userData) => {
    if (hasRedirectedOnce.current) return;

    const currentPath = location.pathname;
    const target = userData.profileIncomplete
      ? '/user/profile'
      : userData.role === 'admin'
      ? '/admin/dashboard'
      : userData.role === 'editor'
      ? '/editor/dashboard'
      : '/user/dashboard';

    const allowedInitialRoutes = ['/login', '/unauthorized'];
    const shouldRedirect = allowedInitialRoutes.includes(currentPath) && currentPath !== target;

    if (shouldRedirect) {
      console.log('AuthProvider: Redirecting to:', target);
      navigate(target, { replace: true });
      hasRedirectedOnce.current = true;
    } else {
      console.log('AuthProvider: No redirect needed for path:', currentPath);
    }
  }, [location.pathname, navigate]);

  const login = useCallback(async (credentials) => {
    if (!auth || !credentials?.email || !credentials?.password) {
      showToast('Correo/contraseña requeridos', 'error');
      throw new Error('Credenciales inválidas');
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      if (!userCredential.user.emailVerified) {
        await sendEmailVerification(userCredential.user);
        showToast('Por favor, verifica tu correo electrónico', 'warn');
        throw new Error('Correo no verificado');
      }
      const userData = await fetchOrCreateUserData(userCredential.user);
      const mappedUser = {
        ...userData,
        email: credentials.email,
        uid: userCredential.user.uid,
      };
      setUser(mappedUser);
      showToast('Inicio de sesión exitoso', 'success');
      handleInitialRedirect(userData);
      return { success: true, user: mappedUser };
    } catch (error) {
      const errorMessages = {
        'auth/invalid-email': 'Correo inválido',
        'auth/wrong-password': 'Contraseña incorrecta',
        'auth/user-not-found': 'Usuario no encontrado',
        'auth/too-many-requests': 'Demasiados intentos, intenta de nuevo más tarde',
      };
      const errorMessage = errorMessages[error.code] || 'Error al iniciar sesión';
      showToast(errorMessage, 'error');
      throw new Error(errorMessage);
    }
  }, [navigate, handleInitialRedirect]);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      setUser(null);
      hasRedirectedOnce.current = false; // Permitir redirección tras próximo login
      showToast('Sesión cerrada', 'success');
      navigate('/login', { replace: true });
    } catch (error) {
      showToast('Error al cerrar sesión', 'error');
      throw error;
    }
  }, [navigate]);

  const signup = useCallback(async ({ email, password, username }) => {
    if (!auth || !email || !password || !username) {
      showToast('Datos requeridos', 'error');
      throw new Error('Datos incompletos');
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      await sendEmailVerification(firebaseUser);
      const userData = {
        role: 'user',
        permissions: ['view:profile', 'view:devices', 'control:own_devices'],
        email,
        username,
        name: '',
        address: { street: '', city: '', postalCode: '', country: '' },
        phone: '',
        notificationPrefs: { email: true, sms: false },
        devices: [],
        createdAt: new Date(),
        profileIncomplete: true,
        fcmToken: '',
      };
      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      setUser({ ...userData, email, uid: firebaseUser.uid });
      showToast('Registro exitoso. Por favor, verifica tu correo.', 'success');
      navigate('/login', { replace: true });
      return { success: true, user: { ...userData, email, uid: firebaseUser.uid } };
    } catch (error) {
      const errorMessages = {
        'auth/email-already-in-use': 'El correo ya está registrado',
        'auth/invalid-email': 'Correo inválido',
        'auth/weak-password': 'La contraseña es demasiado débil',
      };
      const errorMessage = errorMessages[error.code] || 'Error al registrarse';
      showToast(errorMessage, 'error');
      throw new Error(errorMessage);
    }
  }, [navigate]);

  const updateUserProfile = useCallback(async (updates) => {
    if (!user || !auth.currentUser) {
      showToast('No estás autenticado', 'error');
      throw new Error('No autenticado');
    }
    try {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userDocRef, updates);
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      showToast('Perfil actualizado', 'success');
      return { success: true, user: updatedUser };
    } catch (error) {
      showToast('Error al actualizar perfil', 'error');
      throw error;
    }
  }, [user]);

  useEffect(() => {
    if (!auth || authListenerInitialized.current) return;
    authListenerInitialized.current = true;
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          if (!firebaseUser.emailVerified) {
            showToast('Por favor, verifica tu correo electrónico', 'warn');
            setUser(null);
            if (location.pathname !== '/login') navigate('/login', { replace: true });
            return;
          }
          const userData = await fetchOrCreateUserData(firebaseUser);
          const mappedUser = {
            ...userData,
            email: firebaseUser.email,
            uid: firebaseUser.uid,
          };
          setUser(mappedUser);
          handleInitialRedirect(userData);
        } else {
          setUser(null);
          const protectedRoutes = ['/user', '/admin', '/editor', '/Horarios', '/Tareas'];
          if (protectedRoutes.some(route => location.pathname.startsWith(route))) {
            navigate('/login', { replace: true });
          }
        }
      } catch (error) {
        showToast('Error de autenticación', 'error');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }, (error) => {
      showToast('Error de Firebase', 'error');
      setIsLoading(false);
    });
    return () => {
      authListenerInitialized.current = false;
      unsubscribe();
    };
  }, [navigate, handleInitialRedirect]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (user) {
        logout();
        showToast('Sesión expirada', 'warn');
      }
    }, 30 * 60 * 1000); // 30 minutos
    return () => clearTimeout(timeout);
  }, [user, logout]);

  const value = {
    user,
    isLoading,
    login,
    logout,
    signup,
    updateUserProfile,
    checkPermissionAccess,
    checkDeviceAccess,
  };

  return <AuthContext.Provider value={value}>{!isLoading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};