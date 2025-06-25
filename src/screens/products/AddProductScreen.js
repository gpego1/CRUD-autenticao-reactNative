import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ProductsContext } from '../../contexts/ProductsContext';
import { AuthContext } from '../../contexts/AuthContext';

const AddProductScreen = () => {
    const { id, name: paramName, price: paramPrice, description: paramDescription } = useLocalSearchParams();
    const isEditing = !!id;

    const [name, setName] = useState(paramName || '');
    const [price, setPrice] = useState(paramPrice || '');
    const [description, setDescription] = useState(paramDescription || '');

    const { addProduct, deleteProduct } = useContext(ProductsContext);
    const { user } = useContext(AuthContext);

    const handleAddOrUpdate = async () => {
        if (!name || !price || !description) {
            Alert.alert('Erro', 'Preencha todos os campos');
            return;
        }

        try {
            if (!user?.uid) throw new Error("Usuário não autenticado corretamente");

            await addProduct({
                name,
                price: parseFloat(price),
                description,
                ...(isEditing && { id }), // Se estiver editando, inclui o ID
            }, user.uid);

            Alert.alert('Sucesso', isEditing ? 'Produto atualizado' : 'Produto adicionado', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (error) {
            console.error("Erro:", error);
            Alert.alert('Erro', error.message);
        }
    };

    const handleDelete = async () => {
        Alert.alert('Excluir Produto', 'Tem certeza que deseja excluir este produto?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Excluir',
                style: 'destructive',
                onPress: async () => {
                    try {
                        if (!user?.uid) throw new Error("Usuário não autenticado corretamente");
                        await deleteProduct(user.uid, id);
                        Alert.alert('Sucesso', 'Produto excluído com sucesso');
                        router.back();
                    } catch (error) {
                        console.error('Erro ao excluir:', error);
                        Alert.alert('Erro', error.message);
                    }
                }
            }
        ]);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{isEditing ? 'Editar Produto' : 'Adicionar Produto'}</Text>
            <TextInput
                style={styles.input}
                placeholder="Nome"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Preço"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
            />
            <TextInput
                style={[styles.input, styles.descriptionInput]}
                placeholder="Descrição"
                value={description}
                onChangeText={setDescription}
                multiline
            />
            <Button title={isEditing ? "Atualizar" : "Salvar"} onPress={handleAddOrUpdate} />

            {isEditing && (
                <View style={{ marginTop: 20 }}>
                    <Button title="Excluir Produto" color="red" onPress={handleDelete} />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 20,
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    descriptionInput: {
        height: 100,
        textAlignVertical: 'top',
    },
});

export default AddProductScreen;
