import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useProducts } from '../../contexts/ProductsContext';
import CustomAlert from '../common/CustomAlert';
import { useRouter } from 'expo-router'; // Use useRouter aqui

export default function AddProductScreen() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [alertMessage, setAlertMessage] = useState(null);
  const { addProduct, loadingProducts } = useProducts();
  const router = useRouter(); // Use useRouter aqui

  const handleAddProduct = async () => {
    if (!name || !price || !description) { setAlertMessage("Todos os campos são obrigatórios."); return; }
    if (isNaN(parseFloat(price))) { setAlertMessage("O preço deve ser um número válido."); return; }

    try {
      await addProduct({ name, price: parseFloat(price), description });
      setAlertMessage("Produto adicionado com sucesso!");
      router.back(); // Use router.back()
    } catch (err) {
      setAlertMessage(err.message || "Erro ao adicionar produto.");
    }
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Adicionar Produto</Text>
      <TextInput style={styles.input} placeholder="Nome do Produto" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Preço" value={price} onChangeText={setPrice} keyboardType="numeric" />
      <TextInput style={[styles.input, styles.textArea]} placeholder="Descrição" value={description} onChangeText={setDescription} multiline numberOfLines={4} />
      <CustomAlert message={alertMessage} type="error" onConfirm={() => setAlertMessage(null)} visible={!!alertMessage} />
      <TouchableOpacity style={styles.primaryButton} onPress={handleAddProduct} disabled={loadingProducts}>
        {loadingProducts ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Adicionar Produto</Text>}
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryButton} onPress={() => router.back()}> {/* Use router.back() */}
        <Text style={styles.secondaryButtonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: { flex: 1, padding: 20, backgroundColor: '#f8f9fa', paddingTop: 20, },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, color: '#343a40', textAlign: 'center', },
  input: { width: '100%', padding: 15, borderWidth: 1, borderColor: '#ced4da', borderRadius: 8, marginBottom: 15, backgroundColor: '#ffffff', fontSize: 16, },
  textArea: { minHeight: 100, textAlignVertical: 'top', },
  primaryButton: { width: '100%', padding: 15, backgroundColor: '#28a745', borderRadius: 8, alignItems: 'center', marginBottom: 10, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, },
  primaryButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', },
  secondaryButton: { width: '100%', padding: 15, backgroundColor: '#6c757d', borderRadius: 8, alignItems: 'center', marginBottom: 10, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, },
  secondaryButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', },
});