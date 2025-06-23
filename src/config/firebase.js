// src/config/firebase.js

// Importações gerais do Firebase
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Importações específicas para autenticação no Firebase
import { 
  getAuth, // Usado para web ou quando não precisa de persistência explícita
  initializeAuth, // Usado para mobile para configurar persistência
  getReactNativePersistence // Necessário para persistência em React Native
} from 'firebase/auth';

// Importação para persistência de dados em React Native
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Importação do Expo para acessar configurações do app.json, se necessário
// Removi o Constants para a firebaseConfig direta, mas você pode reintroduzir
// se precisar acessar outras configs do app.json no futuro.
// import Constants from 'expo-constants'; 

// Sua configuração do Firebase. 
// Estes valores são os mesmos que você tem na seção 'web.config.firebase' do seu app.json.
// Eles são usados para a inicialização JavaScript em ambos os ambientes.
const firebaseConfig = {
  apiKey: "AIzaSyBlRxivvC3nn95YtPc1eOgMNP09IHe5uGg",
  authDomain: "produtosapp-61cf0.firebaseapp.com",
  projectId: "produtosapp-61cf0",
  storageBucket: "produtosapp-61cf0.firebasestorage.app",
  messagingSenderId: "771998718087",
  appId: "1:771998718087:web:8e27f0d6e23d92d94e8022" 
};

let app;
// Verifica se já existe uma instância do app Firebase inicializada.
// Isso é crucial para evitar erros de inicialização duplicada, 
// especialmente com o Fast Refresh do React Native.
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp(); // Pega a instância existente
}

// Inicializa o Firestore
const db = getFirestore(app);

let auth;
// Verifica se estamos em um ambiente React Native (mobile) para configurar a persistência
// O 'react-native' é um ambiente de execução comum para Expo Go e builds EAS.
if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
  try {
    // Tenta inicializar com persistência para React Native.
    // É importante usar initializeAuth aqui.
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage)
    });
  } catch (e) {
    // Se o auth já foi inicializado (ex: por Fast Refresh), 
    // ou se houver outro erro, apenas tenta obter a instância existente.
    if (e.code === 'auth/auth-domain-config-empty' || e.code === 'auth/no-app') {
      // Erros comuns se initializeAuth for chamado novamente sem uma config válida
      auth = getAuth(app); // Retorna a instância existente se já houver uma
    } else {
      console.error("Erro ao inicializar Firebase Auth com persistência:", e);
      auth = getAuth(app); // Tenta obter a instância de qualquer forma
    }
  }
} else {
  // Para ambiente web ou outros ambientes que não sejam React Native, 
  // usa getAuth sem persistência explícita (usa padrão do navegador)
  auth = getAuth(app);
}

// O appId da configuração web é exportado, se necessário para outras partes do seu app
const appId = firebaseConfig.appId;

// Exporta as instâncias configuradas para serem usadas em outras partes do seu aplicativo
export { app, auth, db, firebaseConfig, appId };