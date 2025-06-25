import { useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Link } from 'expo-router';
import { ProductsContext } from '../../contexts/ProductsContext';
import { AuthContext } from '../../contexts/AuthContext';

export default function ListProductsScreen() {
    const { products, loading, fetchProducts, deleteProduct } = useContext(ProductsContext);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user?.uid) {
            fetchProducts(user.uid).catch(error => {
                console.error('Erro ao buscar produtos:', error);
                Alert.alert('Erro', 'Não foi possível carregar os produtos');
            });
        }
    }, [user]);

    const handleDelete = (productId) => {
        if (!user?.uid) {
            Alert.alert('Erro', 'Usuário não autenticado');
            return;
        }

        Alert.alert(
            'Confirmar exclusão',
            'Tem certeza que deseja excluir este produto?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteProduct(user.uid, productId);
                            Alert.alert('Sucesso', 'Produto excluído');
                        } catch (error) {
                            console.error('Erro ao excluir produto:', error);
                            Alert.alert('Erro', 'Não foi possível excluir o produto');
                        }
                    }
                }
            ]
        );
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#007bff" />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Link
                href="/add-product"
                style={{
                    backgroundColor: '#007bff',
                    padding: 10,
                    borderRadius: 5,
                    marginBottom: 16,
                    textAlign: 'center',
                    color: 'white',
                    fontWeight: 'bold'
                }}
            >
                Adicionar Produto
            </Link>

            <FlatList
                data={products}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View
                        style={{
                            backgroundColor: 'white',
                            padding: 16,
                            marginBottom: 8,
                            borderRadius: 5,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.2,
                            shadowRadius: 1,
                            elevation: 2
                        }}
                    >
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
                        <Text>Preço: R$ {item.price}</Text>
                        <Text>Descrição: {item.description}</Text>

                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <Link
                                href={`/edit-product/${item.id}`}
                                style={{
                                    backgroundColor: '#4CAF50',
                                    padding: 8,
                                    borderRadius: 4,
                                    marginRight: 8,
                                    color: 'white'
                                }}
                            >
                                Editar
                            </Link>
                            <Link
                                href={`/product-details/${item.id}`}
                                style={{
                                    backgroundColor: '#2196F3',
                                    padding: 8,
                                    borderRadius: 4,
                                    marginRight: 8,
                                    color: 'white'
                                }}
                            >
                                Detalhes
                            </Link>
                            <TouchableOpacity
                                onPress={() => handleDelete(item.id)}
                                style={{
                                    backgroundColor: '#F44336',
                                    padding: 8,
                                    borderRadius: 4
                                }}
                            >
                                <Text style={{ color: 'white' }}>Excluir</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    );
}
