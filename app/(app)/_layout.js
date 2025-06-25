import { Stack, useRouter } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import { useContext } from 'react';
import { AuthContext } from '../../src/contexts/AuthContext';

export default function AppLayout() {
    const router = useRouter();
    const { logout } = useContext(AuthContext);

    const handleSignOut = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: '#007bff' },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold' },
            }}
        >
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
                                onPress={handleSignOut}
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
        </Stack>
    );
}
