import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { ProductsContext } from '../../contexts/ProductsContext';
import { AuthContext } from '../../contexts/AuthContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useContext(AuthContext);
  const { products } = useContext(ProductsContext);

  const handleLogout = () => {
    console.log('handleLogout chamado'); // DEBUG
    Alert.alert(
        'Sair',
        'Tem certeza que deseja sair da sua conta?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Sair',
            onPress: async () => {
              try {
                console.log('Logout iniciado'); // DEBUG
                await logout();
                console.log('Logout realizado com sucesso'); // DEBUG
              } catch (error) {
                console.error('Erro ao sair:', error);
                Alert.alert('Erro', 'Não foi possível sair. Tente novamente.');
              }
            },
          },
        ],
    );
  };


  if (!user) {
    return (
        <View style={styles.container}>
          <Text>Carregando informações do usuário...</Text>
        </View>
    );
  }

  return (
      <View style={styles.container}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user.email.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{products.length}</Text>
            <Text style={styles.statLabel}>Produtos cadastrados</Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.sectionTitle}>Informações da Conta</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>ID do Usuário:</Text>
            <Text style={styles.infoValue}>{user.uid}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Data de Criação:</Text>
            <Text style={styles.infoValue}>
              {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : 'Indisponível'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.7} // para feedback visual no clique
        >
          <Text style={styles.logoutButtonText}>Sair da Conta</Text>
        </TouchableOpacity>

      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 18,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 'auto',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
