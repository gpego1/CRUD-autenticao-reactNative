import '../src/config/firebase'; // Garante que o firebase.js seja executado e inicialize o Firebase
import React, { useEffect } from 'react';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import { Stack, useSegments, useRouter, SplashScreen } from 'expo-router';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import { ProductsProvider } from '../src/contexts/ProductsContext';
import { auth } from '../src/config/firebase'; // Importa a instância de auth do seu arquivo de configuração

// Previne que a tela de splash seja escondida automaticamente até que o AuthContext esteja pronto
SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { user, loading } = useAuth(); // 'loading' indica se o AuthContext está carregando
  const segments = useSegments(); // Para saber a rota atual
  const router = useRouter(); // Para navegação

  // --- Console Logs de Diagnóstico ---
  useEffect(() => {
    console.log("-----------------------------------------");
    console.log("RootNavigator montado/atualizado.");
    console.log("Estado de 'loading' do useAuth:", loading); // true ou false
    console.log("Objeto 'auth' importado de firebase.js:", auth); // O objeto 'auth' em si
    
    if (auth && typeof auth.onAuthStateChanged === 'function') {
      console.log("SUCESSO: 'auth.onAuthStateChanged' é uma função. Auth parece válido.");
    } else {
      console.log("FALHA: 'auth.onAuthStateChanged' NÃO é uma função ou 'auth' é inválido.");
      console.log("Tipo de 'auth':", typeof auth);
      if (auth && auth.constructor) {
          console.log("Construtor de 'auth':", auth.constructor.name);
      }
    }
    console.log("-----------------------------------------");
  }, [auth, loading]); // Dependências para que este useEffect rode quando 'auth' ou 'loading' mudar

  // Esconde a tela de splash quando o carregamento inicial do AuthContext terminar
  useEffect(() => {
    if (!loading) {
      SplashScreen.hideAsync();
    }
  }, [loading]);

  // Lógica de redirecionamento baseada no estado de autenticação
  useEffect(() => {
    // Não tenta redirecionar enquanto o AuthContext está carregando
    if (loading) return;
    
    // Verifica se a instância 'auth' do Firebase foi carregada corretamente.
    // Se 'auth' for null/undefined ou não tiver as propriedades esperadas,
    // significa que a inicialização do Firebase Auth falhou.
    if (!auth || typeof auth.onAuthStateChanged !== 'function') {
      console.error("ERRO CRÍTICO: Firebase Auth não inicializado ou inválido. O aplicativo pode não funcionar corretamente.");
      // Você pode querer renderizar uma tela de erro permanente aqui, ou tentar recarregar.
      return; 
    }

    const inAuthGroup = segments[0] === '(auth)'; // Verifica se a rota atual está no grupo de autenticação

    if (user && inAuthGroup) {
      // Se o usuário está logado E está no grupo de rotas de autenticação, redireciona para a home do app
      router.replace('/products'); 
    } else if (!user && !inAuthGroup) {
      // Se o usuário NÃO está logado E NÃO está no grupo de rotas de autenticação, redireciona para o login
      router.replace('/login');
    }
  }, [user, loading, segments, router, auth]); // Dependências para que este useEffect rode quando as variáveis mudarem

  // Enquanto o AuthContext está carregando, mostra um indicador de carregamento
  if (loading) {
    return (
      <View style={styles.fullScreenCenter}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 10 }}>Preparando aplicação...</Text>
      </View>
    );
  }

  // Se a instância 'auth' falhar (diagnóstico de erro crítico)
  // Esta verificação é mais um 'fallback' visual, o useEffect acima já lida com o redirecionamento.
  if (!auth || typeof auth.onAuthStateChanged !== 'function') {
    return (
      <View style={styles.fullScreenCenter}>
        <Text style={styles.errorText}>
          Erro crítico: As configurações do Firebase Auth não foram carregadas corretamente.
          Por favor, reinicie o aplicativo ou verifique a conexão.
        </Text>
      </View>
    );
  }

  // Renderiza o Stack Navigator principal, definindo os grupos de rotas
  return (
    <Stack>
      {/* O grupo (auth) terá suas próprias telas de login/cadastro sem cabeçalho */}
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      {/* O grupo (app) terá suas telas principais sem cabeçalho definido aqui,
          pois o (app)/_layout.js gerencia o cabeçalho para esse grupo */}
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
    </Stack>
  );
}

// Estilos para telas de carregamento/erro
const styles = StyleSheet.create({
  fullScreenCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 18,
    textAlign: 'center',
    marginHorizontal: 20,
  }
});

// Componente principal do layout do aplicativo que provê os contextos
export default function AppLayout() {
  return (
    <AuthProvider>
      <ProductsProvider>
        <RootNavigator />
      </ProductsProvider>
    </AuthProvider>
  );
}