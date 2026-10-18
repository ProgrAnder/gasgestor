import { initializeApp } from 'firebase/app';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore';

// Las variables de entorno se leen desde .env.local
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'DEMO_KEY',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'gasgestor.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'gasgestor',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'gasgestor.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789:web:abcdef',
};

// Inicializar Firebase
export const app = initializeApp(firebaseConfig);

// Inicializar Firestore con soporte OFFLINE nativo multi-pestaña
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});
