import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBlRxivvC3nn95YtPc1eOgMNP09IHe5uGg",
  authDomain: "produtosapp-61cf0.firebaseapp.com",
  projectId: "produtosapp-61cf0",
  storageBucket: "produtosapp-61cf0.appspot.com",
  messagingSenderId: "771998718087",
  appId: "1:771998718087:web:8e27f0d6e23d92d94e8022"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);