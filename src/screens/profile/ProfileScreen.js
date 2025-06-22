import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import CustomAlert from '../common/CustomAlert';
// Não é necessário useRouter aqui, pois o logout é tratado pelo AuthContext e _layout.js

export default function ProfileScreen() {
  const { user, signOutUser, loading } = useAuth();
  const [alertMessage, setAlertMessage] = useState(null);

  const handleLogout = async () => {
    try {
      await signOutUser();
      setAlertMessage("Sessão encerrada com sucesso!");
      // O redirecionamento para o login é tratado no app/_layout.js
    } catch (err) {
      setAlertMessage(err.message || "Erro ao fazer logout.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil do Usuário</Text>
      {user ? (
        <View style={styles.profileInfo}>
          <Text style={styles.profileText}>E-mail: {user.email}</Text>
          <Text style={styles.profileText}>UID: {user.uid}</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.logoutButtonText}>Sair</Text>}
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.profileText}>Nenhum usuário logado.</Text>
      )}
      <CustomAlert message={alertMessage} onConfirm={() => setAlertMessage(null)} visible={!!alertMessage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa', paddingTop: 20, alignItems: 'center', },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, color: '#343a40', textAlign: 'center', },
  profileInfo: { backgroundColor: '#ffffff', borderRadius: 10, padding: 20, width: '100%', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2, },
  profileText: { fontSize: 18, color: '#343a40', marginBottom: 10, textAlign: 'center', },
  logoutButton: { width: '80%', padding: 12, backgroundColor: '#dc3545', borderRadius: 8, alignItems: 'center', marginTop: 20, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, },
  logoutButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', },
});