// src/screens/products/ListProductsScreen.js
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useProducts } from '../../contexts/ProductsContext'; // Importa o hook do contexto de produtos
import CustomAlert from '../common/CustomAlert'; // Componente de alerta
import { useRouter } from 'expo-router'; // Hook de navegação do Expo Router

export default function ListProductsScreen() {
  // Obtém os produtos, status de carregamento, função de exclusão e erros do contexto
  const { products, loadingProducts, deleteProduct, error } = useProducts();
  const router = useRouter(); // Instância do router para navegação

  // Estados para controlar o modal de confirmação de exclusão
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Inicia como false para não aparecer no início
  const [productToDelete, setProductToDelete] = useState(null); // Armazena o ID do produto a ser deletado
  const [alertMessage, setAlertMessage] = useState(null); // Mensagens de alerta para o usuário

  // Função para lidar com o clique no botão de deletar de um produto
  const handleDeletePress = (productId) => {
    setProductToDelete(productId); // Define o produto a ser deletado
    setShowConfirmModal(true); // Exibe o modal de confirmação
  };

  // Função para confirmar a exclusão do produto
  const confirmDelete = async () => {
    setShowConfirmModal(false); // Esconde o modal de confirmação
    if (productToDelete) { // Garante que há um produto para deletar
      try {
        await deleteProduct(productToDelete); // Chama a função de exclusão do contexto
        setAlertMessage("Produto deletado com sucesso!"); // Mensagem de sucesso
      } catch (err) {
        setAlertMessage(err.message || "Erro ao deletar produto."); // Mensagem de erro
      } finally {
        setProductToDelete(null); // Limpa o ID do produto a ser deletado
      }
    }
  };

  // Função para cancelar a exclusão do produto
  const cancelDelete = () => {
    setShowConfirmModal(false); // Esconde o modal
    setProductToDelete(null); // Limpa o ID
  };

  // Exibe um indicador de carregamento enquanto os produtos estão sendo carregados
  if (loadingProducts) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Carregando produtos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Produtos</Text>

      {/* Condição para exibir mensagem se não houver produtos */}
      {products.length === 0 && !loadingProducts ? (
        <Text style={styles.noProductsText}>Nenhum produto cadastrado ainda.</Text>
      ) : (
        // Lista de produtos usando FlatList
        <FlatList
          data={products} // Dados da lista
          keyExtractor={(item) => item.id} // Chave única para cada item
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>R$ {parseFloat(item.price || 0).toFixed(2)}</Text>
              <Text style={styles.productDescription}>{item.description}</Text>
              <View style={styles.productActions}>
                {/* Botão de Editar */}
                <TouchableOpacity
                  style={[styles.actionButton, styles.editButton]}
                  onPress={() => router.push(`/edit-product/${item.id}`)} // Navega para a tela de edição com o ID do produto
                >
                  <Text style={styles.actionButtonText}>Editar</Text>
                </TouchableOpacity>
                {/* Botão de Excluir */}
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleDeletePress(item.id)} // Chama a função para exibir o modal de confirmação
                >
                  <Text style={styles.actionButtonText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* Alertas para erros do contexto de produtos */}
      <CustomAlert message={error} type="error" onConfirm={() => {}} visible={!!error} />
      {/* Alertas para mensagens de sucesso/erro após operações */}
      <CustomAlert message={alertMessage} onConfirm={() => setAlertMessage(null)} visible={!!alertMessage} />

      {/* Modal de confirmação para exclusão */}
      <CustomAlert
        message="Tem certeza que deseja deletar este produto?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        type="error" // Exibe como erro para enfatizar a ação
        visible={showConfirmModal} // Controlado pelo estado showConfirmModal
      />

      {/* Botão flutuante para adicionar novo produto */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => router.push('/add-product')} // Navega para a tela de adicionar produto
      >
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

// Estilos do componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
    paddingTop: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#343a40',
    textAlign: 'center',
  },
  productCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderLeftWidth: 5,
    borderLeftColor: '#007bff',
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 18,
    color: '#28a745',
    marginBottom: 5,
  },
  productDescription: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 10,
  },
  productActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  editButton: {
    backgroundColor: '#ffc107',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  floatingButton: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
    backgroundColor: '#007bff',
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  floatingButtonText: {
    fontSize: 30,
    color: '#fff',
    lineHeight: 30,
  },
  noProductsText: {
    fontSize: 18,
    color: '#6c757d',
    textAlign: 'center',
    marginTop: 50,
  },
});