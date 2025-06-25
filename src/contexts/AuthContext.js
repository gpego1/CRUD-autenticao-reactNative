import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { router } from 'expo-router';
import bcrypt from 'react-native-bcrypt';

// ⚠️ Importe antes do uuid para funcionar no React Native
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const session = await AsyncStorage.getItem('userSession');
        if (session) {
          const userData = JSON.parse(session);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error loading session:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const normalizedEmail = email.toLowerCase().trim();

      const emailDoc = await getDoc(doc(db, 'artifacts', '1:771998718087:web:8e27f0d6e23d92d94e8022', 'emails', normalizedEmail));
      if (!emailDoc.exists()) {
        throw new Error('Email não cadastrado');
      }

      const userId = emailDoc.data().userId;
      const userDoc = await getDoc(doc(db, 'artifacts', '1:771998718087:web:8e27f0d6e23d92d94e8022', 'users', userId));
      if (!userDoc.exists()) {
        throw new Error('Usuário não encontrado');
      }

      const userData = userDoc.data();
      if (!bcrypt.compareSync(password, userData.password)) {
        throw new Error('Senha incorreta');
      }

      const sessionData = {
        ...userData,
        uid: userId,
        email: normalizedEmail,
      };

      await AsyncStorage.setItem('userSession', JSON.stringify(sessionData));
      setUser(sessionData);

      router.replace('/(app)/products');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password) => {
    try {
      setLoading(true);
      const normalizedEmail = email.toLowerCase().trim();

      const emailDoc = await getDoc(doc(db, 'system/emails', normalizedEmail));
      if (emailDoc.exists()) {
        throw new Error('Email já cadastrado');
      }

      const userId = uuidv4();
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      await setDoc(doc(db, 'users', userId), {
        uid: userId,
        email: normalizedEmail,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
      });

      await setDoc(doc(db, 'system/emails', normalizedEmail), { userId });

      const sessionData = {
        uid: userId,
        email: normalizedEmail,
      };

      await AsyncStorage.setItem('userSession', JSON.stringify(sessionData));
      setUser(sessionData);

      router.replace('/(app)/products');
      return userId;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userSession');
      setUser(null);
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return (
      <AuthContext.Provider value={{ user, loading, login, register, logout }}>
        {children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};