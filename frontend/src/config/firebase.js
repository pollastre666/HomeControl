import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { toast } from 'react-toastify';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const requiredConfigKeys = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId',
];

const missingKeys = requiredConfigKeys.filter((key) => !firebaseConfig[key]);

if (missingKeys.length > 0) {
  throw new Error(
    `Missing Firebase configuration keys: ${missingKeys.join(', ')}. Please check your environment variables.`
  );
}

let app, auth, db;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);

  // Iniciar sesión anónima al cargar la app
  signInAnonymously(auth)
    .then(() => {
      if (process.env.NODE_ENV === 'development') {
        console.log('Usuario anónimo autenticado');
      }
    })
    .catch((error) => {
      console.error('Error al autenticar usuario anónimo:', {
        message: error.message,
        code: error.code,
        stack: error.stack,
      });
      toast.error('Error al autenticar. Intenta de nuevo.');
    });

  // Enable offline persistence
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Offline persistence can only be enabled in one tab at a time.');
      toast.warn('Persistencia sin conexión solo puede habilitarse en una pestaña a la vez.');
    } else if (err.code === 'unimplemented') {
      console.warn('Offline persistence is not supported by this browser.');
      toast.warn('Este navegador no soporta persistencia sin conexión.');
    } else {
      console.error('Failed to enable offline persistence:', err);
      toast.error('Error al habilitar persistencia sin conexión.');
    }
  });

  if (process.env.NODE_ENV === 'development') {
    console.log('Proceso de entorno completo:', process.env);
    console.log('Variables de entorno específicas:', {
      REACT_APP_FIREBASE_API_KEY: process.env.REACT_APP_FIREBASE_API_KEY,
      REACT_APP_FIREBASE_AUTH_DOMAIN: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
      REACT_APP_FIREBASE_PROJECT_ID: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    });
    console.log('Firebase initialized with project:', firebaseConfig.projectId);
  }
} catch (error) {
  console.error('Failed to initialize Firebase:', {
    message: error.message,
    code: error.code,
    stack: error.stack,
  });
  throw error;
}

export { app, auth, db };