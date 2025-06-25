import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../../config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// IMPORTANTE: importe isso antes do uuid para "polyfill" do getRandomValues no React Native
import 'react-native-get-random-values';

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
            // Gera um userId único usando uuid
            const userId = uuidv4();

            // Hashea a senha
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(password, salt);

            // Verifica se o email já existe
            const emailDoc = await getDoc(doc(db, 'artifacts/1:771998718087:web:8e27f0d6e23d92d94e8022/emails', email.toLowerCase().trim()));
            if (emailDoc.exists()) {
                Alert.alert('Erro', 'Este email já está cadastrado');
                setLoading(false);
                return;
            }

            // Cria documento do usuário
            const userDocRef = doc(db, `artifacts/1:771998718087:web:8e27f0d6e23d92d94e8022/users/${userId}`);
            await setDoc(userDocRef, {
                uid: userId,
                email: email.toLowerCase().trim(),
                password: hashedPassword,
                createdAt: new Date().toISOString(),
                lastLogin: null
            });

            // Cria referência do email para garantir unicidade
            await setDoc(doc(db, 'artifacts/1:771998718087:web:8e27f0d6e23d92d94e8022/emails', email.toLowerCase().trim()), {
                userId: userId,
                createdAt: new Date().toISOString()
            });

            // Salva sessão do usuário localmente
            await AsyncStorage.setItem('userToken', JSON.stringify({
                uid: userId,
                email: email.toLowerCase().trim(),
                loggedInAt: new Date().toISOString()
            }));

            // Navega para tela de produtos após sucesso
            router.replace('/(app)/products');

        } catch (error) {
            console.error('Erro no registro:', error);
            Alert.alert('Erro', error.message || 'Ocorreu um erro ao registrar');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Criar Conta</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
            />

            <TextInput
                style={styles.input}
                placeholder="Senha (mínimo 6 caracteres)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TextInput
                style={styles.input}
                placeholder="Confirmar Senha"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />

            <TouchableOpacity
                style={[styles.button, loading && styles.disabledButton]}
                onPress={handleRegister}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Registrar</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => router.replace('/login')}
            >
                <Text style={styles.secondaryButtonText}>Já tem uma conta? Faça login</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
        color: '#333'
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: '#fff',
        fontSize: 16
    },
    button: {
        backgroundColor: '#007bff',
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
    },
    disabledButton: {
        backgroundColor: '#cccccc'
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600'
    },
    secondaryButton: {
        alignSelf: 'center'
    },
    secondaryButtonText: {
        color: '#007bff',
        fontSize: 16
    }
};
