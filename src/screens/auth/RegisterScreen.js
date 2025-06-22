import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import CustomAlert from '../common/CustomAlert';
import { useRouter } from 'expo-router'; 

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const { signUp, loading } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    if (password !== confirmPassword) { setError("As senhas não coincidem."); return; }
    try {
      setError(null);
      await signUp(email, password);
      
    } catch (err) {
      let errorMessage = "Erro ao registrar. Tente novamente.";
      if (err.code === 'auth/email-already-in-use') { errorMessage = "Este e-mail já está em uso."; }
      else if (err.code === 'auth/invalid-email') { errorMessage = "E-mail inválido."; }
      else if (err.code === 'auth/weak-password') { errorMessage = "Senha muito fraca (mínimo 6 caracteres)."; }
      setError(errorMessage);
    }
  };

  return (
    <View style={styles.authContainer}>
      <Text style={styles.title}>Cadastre-se</Text>
      <TextInput style={styles.input} placeholder="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Senha (mínimo 6 caracteres)" value={password} onChangeText={setPassword} secureTextEntry />
      <TextInput style={styles.input} placeholder="Confirme a Senha" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
      <CustomAlert message={error} type="error" onConfirm={() => setError(null)} visible={!!error} />
      <TouchableOpacity style={styles.authButton} onPress={handleRegister} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.authButtonText}>Registrar</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/login')}> {/* Use router.push */}
        <Text style={styles.linkText}>Já tem uma conta? Faça login</Text>
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