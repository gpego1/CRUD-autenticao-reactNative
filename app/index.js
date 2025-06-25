import { Redirect } from 'expo-router';
import { useContext } from 'react';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import { AuthContext } from '../src/contexts/AuthContext';

export default function Index() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Verificando autenticação...</Text>
        </View>
    );
  }

  return user ? (
      <Redirect href="/(app)/products" />
  ) : (
      <Redirect href="/(auth)/login" />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#333',
  },
});