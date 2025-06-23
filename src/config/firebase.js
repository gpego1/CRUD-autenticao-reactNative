import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

import { 
  getAuth,
  initializeAuth, 
  getReactNativePersistence 
} from 'firebase/auth';

import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBlRxivvC3nn95YtPc1eOgMNP09IHe5uGg",
  authDomain: "produtosapp-61cf0.firebaseapp.com",
  projectId: "produtosapp-61cf0",
  storageBucket: "produtosapp-61cf0.firebasestorage.app",
  messagingSenderId: "771998718087",
  appId: "1:771998718087:web:8e27f0d6e23d92d94e8022" 
};

let app;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp(); 
}

const db = getFirestore(app);

let auth;
if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage)
    });
  } catch (e) {
    if (e.code === 'auth/auth-domain-config-empty' || e.code === 'auth/no-app') {
      auth = getAuth(app); 
    } else {
      console.error("Erro ao inicializar Firebase Auth com persistência:", e);
      auth = getAuth(app);
    }
  }
} else {
  auth = getAuth(app);
}

const appId = firebaseConfig.appId;

export { app, auth, db, firebaseConfig, appId };