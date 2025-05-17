import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Your Firebase config from src/config/firebase.js
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Add demo device
async function addDemoDevice() {
  try {
    await setDoc(doc(db, 'devices', 'demo_1'), {
      name: 'Dispositivo Demo',
      state: false,
      lastUpdated: Math.floor(Date.now() / 1000),
    });
    console.log('Demo device added successfully');
  } catch (error) {
    console.error('Error adding demo device:', error);
  }
}

addDemoDevice();