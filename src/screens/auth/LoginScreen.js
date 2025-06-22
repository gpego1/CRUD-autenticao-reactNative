import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import CustomAlert from '../common/CustomAlert';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { signIn, loading } = useAuth();
  const router = useRouter(); 

  const handleLogin = async () => {
    try {
      setError(null);
      await signIn(email, password);
    } catch (err) {
      let errorMessage = "Erro no login. Verifique suas credenciais.";
      if (err.code === 'auth/invalid-email') { errorMessage = "E-mail inválido."; }
      else if (err.code === 'auth/user-disabled') { errorMessage = "Usuário desativado."; }
      else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') { errorMessage = "Credenciais inválidas. Verifique seu e-mail e senha."; }
      setError(errorMessage);
    }
  };

  return (
    <View style={styles.authContainer}>
      <Text style={styles.title}>Login</Text>
      <TextInput style={styles.input} placeholder="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry />
      <CustomAlert message={error} type="error" onConfirm={() => setError(null)} visible={!!error} />
      <TouchableOpacity style={styles.authButton} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.authButtonText}>Entrar</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/register')}> {/* Use router.push */}
        <Text style={styles.linkText}>Não tem uma conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  authContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f8f9fa', },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, color: '#343a40', textAlign: 'center', },
  input: { width: '100%', padding: 15, borderWidth: 1, borderColor: '#ced4da', borderRadius: 8, marginBottom: 15, backgroundColor: '#ffffff', fontSize: 16, },
  authButton: { width: '100%', padding: 15, backgroundColor: '#007bff', borderRadius: 8, alignItems: 'center', marginBottom: 10, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, },
  authButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', },
  linkText: { color: '#007bff', marginTop: 10, fontSize: 16, },
});