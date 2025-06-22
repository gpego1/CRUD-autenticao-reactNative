import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useProducts } from '../../contexts/ProductsContext';
import CustomAlert from '../common/CustomAlert';
import { useRouter, useLocalSearchParams } from 'expo-router'; // Use useRouter e useLocalSearchParams aqui

export default function ProductDetailsScreen() {
  const { id: productId } = useLocalSearchParams(); // Pega o ID da URL
  const [product, setProduct] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [alertMessage, setAlertMessage] = useState(null);
  const { getProduct } = useProducts();
  const router = useRouter(); // Use useRouter aqui

  useEffect(() => {
    const fetchDetails = async () => {
      setLoadingDetails(true);
      if (productId) {
        try {
          const fetchedProduct = await getProduct(productId);
          if (fetchedProduct) { setProduct(fetchedProduct); }
          else { setAlertMessage("Produto não encontrado."); }
        } catch (err) { setAlertMessage(err.message || "Erro ao carregar detalhes do produto."); }
      } else { setAlertMessage("ID do produto não fornecido."); }
      setLoadingDetails(false);
    };
    fetchDetails();
  }, [productId, getProduct]);

  if (loadingDetails) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Carregando detalhes do produto...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalhes do Produto</Text>
      {product ? (
        <View style={styles.detailsCard}>
          <Text style={styles.detailLabel}>Nome:</Text>
          <Text style={styles.detailText}>{product.name}</Text>
          <Text style={styles.detailLabel}>Preço:</Text>
          <Text style={styles.detailText}>R$ {parseFloat(product.price || 0).toFixed(2)}</Text>
          <Text style={styles.detailLabel}>Descrição:</Text>
          <Text style={styles.detailText}>{product.description}</Text>
        </View>
      ) : (
        <Text style={styles.noProductText}>Produto não disponível ou não encontrado.</Text>
      )}
      <CustomAlert message={alertMessage} type="error" onConfirm={() => setAlertMessage(null)} visible={!!alertMessage} />
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}> {/* Use router.back() */}
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa', paddingTop: 20, },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa', },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, color: '#343a40', textAlign: 'center', },
  detailsCard: { backgroundColor: '#ffffff', borderRadius: 10, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2, borderLeftWidth: 5, borderLeftColor: '#007bff', },
  detailLabel: { fontSize: 18, fontWeight: 'bold', color: '#343a40', marginBottom: 5, },
  detailText: { fontSize: 16, color: '#6c757d', marginBottom: 15, },
  noProductText: { fontSize: 18, color: '#6c757d', textAlign: 'center', marginTop: 50, },
  backButton: { width: '100%', padding: 15, backgroundColor: '#6c757d', borderRadius: 8, alignItems: 'center', marginTop: 20, },
  backButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', },
});