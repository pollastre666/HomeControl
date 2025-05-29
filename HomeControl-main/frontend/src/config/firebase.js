import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDvVBx0r8MxX6xNe-dHdsvPdzOaORcuEk0",
  authDomain: "homecontrol-dac34.firebaseapp.com",
  projectId: "homecontrol-dac34",
  storageBucket: "homecontrol-dac34.firebasestorage.app",
  messagingSenderId: "860531471097",
  appId: "1:860531471097:web:ed0f6c8638e36226092828"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);