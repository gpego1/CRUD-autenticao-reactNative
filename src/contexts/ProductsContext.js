import React, { createContext, useState, useContext } from 'react';
import { db } from '../config/firebase';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore'; // Faltava importar getDoc

export const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getProductsPath = (userId) => {
    if (!userId) throw new Error("ID do usuário é obrigatório");
    return `artifacts/1:771998718087:web:8e27f0d6e23d92d94e8022/users/${userId}/products`;
  };

  const addProduct = async (productData, userId) => {
    setLoading(true);
    try {
      if (!userId) throw new Error("Usuário não autenticado");
      if (!productData?.name) throw new Error("Nome do produto é obrigatório");

      const productsRef = collection(db, getProductsPath(userId));
      const now = new Date().toISOString();

      const docRef = await addDoc(productsRef, {
        ...productData,
        price: Number(productData.price),
        createdAt: now,
        updatedAt: now
      });

      const newProduct = { id: docRef.id, ...productData };
      setProducts(prev => [...prev, newProduct]);

      return newProduct;
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getProduct = async (userId, productId) => {
    if (!userId) throw new Error("Usuário não autenticado");
    const productRef = doc(db, getProductsPath(userId), productId);
    const productSnap = await getDoc(productRef);
    if (!productSnap.exists()) throw new Error("Produto não encontrado");
    return { id: productSnap.id, ...productSnap.data() };
  };

  const fetchProducts = async (userId) => {
    setLoading(true);
    try {
      const productsRef = collection(db, getProductsPath(userId));
      const snapshot = await getDocs(productsRef);
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsData);
      return productsData;
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (productId, productData, userId) => {
    setLoading(true);
    try {
      if (!userId) throw new Error("Usuário não autenticado");
      if (!productId) throw new Error("ID do produto é obrigatório");

      const productRef = doc(db, getProductsPath(userId), productId);
      const now = new Date().toISOString();

      await updateDoc(productRef, {
        ...productData,
        price: Number(productData.price),
        updatedAt: now
      });

      setProducts(prev => prev.map(p =>
          p.id === productId ? { ...p, ...productData, price: Number(productData.price), updatedAt: now } : p
      ));
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (userId, productId) => {
    setLoading(true);
    try {
      if (!userId) throw new Error("Usuário não autenticado");
      if (!productId) throw new Error("ID do produto é obrigatório");

      const productRef = doc(db, getProductsPath(userId), productId);
      await deleteDoc(productRef);

      setProducts(prev => prev.filter(p => p.id !== productId));
      console.log(`Produto ${productId} excluído com sucesso`);
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };


  return (
      <ProductsContext.Provider value={{
        products,
        loading,
        error,
        addProduct,
        fetchProducts,
        getProduct,
        updateProduct,
        deleteProduct
      }}>
        {children}
      </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};
