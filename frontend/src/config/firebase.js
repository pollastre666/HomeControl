import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { toast } from 'react-toastify';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'AIzaSyDvVBx0r8MxX6xNe-dHdsvPdzOaORcuEk0',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'homecontrol-dac34.firebaseapp.com',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'homecontrol-dac34',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'homecontrol-dac34.firebasestorage.app',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '860531471097',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || '1:860531471097:web:ed0f6c8638e36226092828',
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