import { Stack } from 'expo-router';
import { TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';

export default function AppLayout() {
    const router = useRouter();
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
                        <TouchableOpacity onPress={() => router.push('/profile')} style={{ marginRight: 15 }}>
                            <Text style={{ color: '#fff', fontSize: 16 }}>Perfil</Text>
                        </TouchableOpacity>
                    ),
                }}
            />
            <Stack.Screen name="add-product" options={{ title: 'Adicionar Produto' }} />
            <Stack.Screen name="edit-product/[id]" options={{ title: 'Editar Produto' }} />
            <Stack.Screen name="product-details/[id]" options={{ title: 'Detalhes do Produto' }} />
            <Stack.Screen name="profile" options={{ title: 'Meu Perfil' }} />
        </Stack>
    );
}