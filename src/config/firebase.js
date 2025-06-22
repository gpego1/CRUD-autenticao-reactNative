// src/config/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBlRxivvC3nn95YtPc1eOgMNP09IHe5uGg",
  authDomain: "produtosapp-61cf0.firebaseapp.com",
  projectId: "produtosapp-61cf0",
  storageBucket: "produtosapp-61cf0.firebasestorage.app",
  messagingSenderId: "771998718087",
  appId: "1:771998718087:web:8e27f0d6e23d92d94e8022"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Adicione esta linha para extrair appId para exportação individual
const appId = firebaseConfig.appId;

export { app, auth, db, firebaseConfig, appId }; // Exporte appId