import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../src/config/firebase'; // Ajuste o caminho conforme necessário

export default function AppLayout() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Monitora o estado de autenticação
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{
      headerStyle: { backgroundColor: '#007bff' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
    }}>
      <Stack.Screen
        name="products"
        options={{
          title: 'Meus Produtos',
          headerRight: () => (
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity 
                onPress={() => router.push('/profile')} 
                style={{ marginRight: 15 }}
              >
                <Text style={{ color: '#fff', fontSize: 16 }}>Perfil</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => auth.signOut()}
                style={{ marginRight: 15 }}
              >
                <Text style={{ color: '#fff', fontSize: 16 }}>Sair</Text>
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <Stack.Screen name="add-product" options={{ title: 'Adicionar Produto' }} />
      <Stack.Screen name="edit-product/[id]" options={{ title: 'Editar Produto' }} />
      <Stack.Screen name="product-details/[id]" options={{ title: 'Detalhes do Produto' }} />
      <Stack.Screen name="profile" options={{ title: 'Meu Perfil' }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
    </Stack>
  );
}