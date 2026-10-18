import { initializeApp } from 'firebase/app';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore';

// Credenciales oficiales del proyecto Firebase GasGestor
export const firebaseConfig = {
  apiKey: "AIzaSyAHkNfgBvH_jrD11D2pndWtCuTWW8NHoOA",
  authDomain: "gasgestor.firebaseapp.com",
  projectId: "gasgestor",
  storageBucket: "gasgestor.firebasestorage.app",
  messagingSenderId: "1039878147025",
  appId: "1:1039878147025:web:c0970bbe8d6d96d007aef0"
};

// Inicializar la aplicación de Firebase
export const app = initializeApp(firebaseConfig);

// Inicializar Firestore con soporte OFFLINE nativo multi-pestaña
// Guarda automáticamente en la memoria del teléfono / navegador cuando no hay internet
// y sincroniza solo al recuperar señal.
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});
