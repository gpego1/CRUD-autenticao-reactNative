import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    StyleSheet
} from 'react-native';
import { router } from 'expo-router';
import { db } from '../../config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'react-native-bcrypt';

export default function RegisterScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!email || !password || !confirmPassword) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Erro', 'As senhas não coincidem');
            return;
        }
        if (password.length < 6) {
            Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
            return;
        }
        if (!email.includes('@') || !email.includes('.')) {
            Alert.alert('Erro', 'Por favor, insira um email válido');
            return;
        }

        setLoading(true);

        try {
            const userId = uuidv4();
            const normalizedEmail = email.toLowerCase().trim();

            // Referência correta para o documento do email
            const emailRef = doc(
                db,
                'artifacts',
                '1:771998718087:web:8e27f0d6e23d92d94e8022',
                'emails',
                normalizedEmail
            );
            const existing = await getDoc(emailRef);
            if (existing.exists()) {
                throw new Error('Este email já está cadastrado.');
            }

            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(password, salt);

            // Referência correta para o documento do usuário
            await setDoc(
                doc(
                    db,
                    'artifacts',
                    '1:771998718087:web:8e27f0d6e23d92d94e8022',
                    'users',
                    userId
                ),
                {
                    uid: userId,
                    email: normalizedEmail,
                    password: hashedPassword,
                    createdAt: new Date().toISOString(),
                }
            );

            await setDoc(emailRef, { userId });

            Alert.alert('Sucesso', 'Cadastro realizado! Faça login para continuar.');

            // Redireciona para a tela de login, sem criar sessão automaticamente
            router.replace('/(auth)/login');

        } catch (error) {
            Alert.alert('Erro', error.message || 'Erro ao registrar');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Nova Conta</Text>

            <TextInput
                style={styles.input}
                placeholder="E-mail"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TextInput
                style={styles.input}
                placeholder="Confirmar Senha"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />

            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleRegister}
                disabled={loading}
            >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Registrar</Text>}
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => router.replace('/(auth)/login')}
                style={styles.linkContainer}
            >
                <Text style={styles.linkText}>Já tem uma conta? Faça login</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7FAFC',
        paddingHorizontal: 28,
        justifyContent: 'center',
    },
    title: {
        fontSize: 26,
        color: '#2D3748',
        fontWeight: '700',
        marginBottom: 28,
        textAlign: 'center',
    },
    input: {
        height: 52,
        backgroundColor: '#FFFFFF',
        borderColor: '#E2E8F0',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        marginBottom: 16,
        color: '#2D3748',
    },
    button: {
        backgroundColor: '#3182CE',
        height: 52,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#3182CE',
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    buttonDisabled: {
        backgroundColor: '#90CDF4',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '600',
    },
    linkContainer: {
        alignItems: 'center',
    },
    linkText: {
        color: '#2B6CB0',
        fontSize: 16,
        fontWeight: '500',
    },
});
