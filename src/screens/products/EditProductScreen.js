import { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ProductsContext } from '../../contexts/ProductsContext';
import { AuthContext } from '../../contexts/AuthContext';

export default function EditProductScreen() {
    const { id } = useLocalSearchParams();
    const { products, updateProduct, deleteProduct } = useContext(ProductsContext);
    const { user } = useContext(AuthContext);

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        const product = products.find(p => p.id === id);
        if (product) {
            setName(product.name);
            setPrice(product.price.toString());
            setDescription(product.description);
        }
    }, [id, products]);

    const handleUpdateProduct = async () => {
        if (!name || !price || !description) {
            Alert.alert('Erro', 'Preencha todos os campos');
            return;
        }

        if (!user?.uid) {
            Alert.alert('Erro', 'Usuário não autenticado');
            return;
        }

        try {
            await updateProduct(id, {
                name,
                price: parseFloat(price),
                description,
            }, user.uid);
            Alert.alert('Sucesso', 'Produto atualizado com sucesso');
            router.back();
        } catch (error) {
            console.error('Erro ao atualizar produto:', error);
            Alert.alert('Erro', 'Não foi possível atualizar o produto');
        }
    };

    const handleDeleteProduct = () => {
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
                            if (!user?.uid) {
                                Alert.alert('Erro', 'Usuário não autenticado');
                                return;
                            }
                            await deleteProduct(user.uid, id);
                            Alert.alert('Sucesso', 'Produto excluído com sucesso');
                            router.back();
                        } catch (error) {
                            console.error('Erro ao excluir produto:', error);
                            Alert.alert('Erro', error.message || 'Não foi possível excluir o produto');
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Text style={{ fontSize: 16, marginBottom: 8 }}>Nome:</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Nome do produto"
            />

            <Text style={{ fontSize: 16, marginBottom: 8 }}>Preço:</Text>
            <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                placeholder="Preço"
                keyboardType="numeric"
            />

            <Text style={{ fontSize: 16, marginBottom: 8 }}>Descrição:</Text>
            <TextInput
                style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                value={description}
                onChangeText={setDescription}
                placeholder="Descrição do produto"
                multiline
            />

            <TouchableOpacity
                onPress={handleUpdateProduct}
                style={[styles.button, { backgroundColor: '#007bff', marginBottom: 12 }]}
            >
                <Text style={styles.buttonText}>Atualizar Produto</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={handleDeleteProduct}
                style={[styles.button, { backgroundColor: '#F44336' }]}
            >
                <Text style={styles.buttonText}>Excluir Produto</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = {
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 16,
        padding: 8,
        borderRadius: 4
    },
    button: {
        padding: 12,
        borderRadius: 4,
        alignItems: 'center'
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold'
    }
};
