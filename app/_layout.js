import React, { useEffect } from 'react';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import { Stack, useSegments, useRouter, SplashScreen } from 'expo-router';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import { ProductsProvider } from '../src/contexts/ProductsContext';
import { auth } from '../src/config/firebase'; // Importa a instância de auth

// Previne que a tela de splash seja escondida automaticamente até que o AuthContext esteja pronto
SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      SplashScreen.hideAsync();
    }
  }, [loading]);

  useEffect(() => {
    if (loading) return;
    if (!auth) {
      console.error("Firebase Auth não inicializado. O aplicativo pode não funcionar corretamente.");
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';

    if (user && inAuthGroup) {
      router.replace('/products'); // Redireciona para a lista de produtos
    } else if (!user && !inAuthGroup) {
      router.replace('/login');
    }
  }, [user, loading, segments, router, auth]);

  if (loading) {
    return (
      <View style={styles.fullScreenCenter}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 10 }}>Preparando aplicação...</Text>
      </View>
    );
  }

  if (!auth) {
    return (
      <View style={styles.fullScreenCenter}>
        <Text style={styles.errorText}>
          Erro crítico: As configurações do Firebase não foram carregadas corretamente.
        </Text>
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
    </Stack>
  );
}

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

export default function AppLayout() {
  return (
    <AuthProvider>
      <ProductsProvider>
        <RootNavigator />
      </ProductsProvider>
    </AuthProvider>
  );
}