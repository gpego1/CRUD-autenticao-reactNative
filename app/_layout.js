import '../src/config/firebase';
import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { AuthProvider } from '../src/contexts/AuthContext';
import { ProductsProvider } from '../src/contexts/ProductsContext';

export default function RootLayout() {
  return (
      <AuthProvider>
        <ProductsProvider>
          <InitialLayout />
        </ProductsProvider>
      </AuthProvider>
  );
}

function InitialLayout() {
  return (
      <Stack>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  }
});