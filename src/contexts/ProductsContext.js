// src/contexts/ProductsContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext'; // Importa o hook do contexto de autenticação
import {
  subscribeToProducts,
  addProduct,
  getProduct,
  updateProduct,
  deleteProduct
} from '../services/firestore/products.js';

const ProductsContext = createContext();

// Hook personalizado para usar o contexto de produtos
export const useProducts = () => {
  return useContext(ProductsContext);
};

export const ProductsProvider = ({ children }) => {
  // Obtém o usuário e o status de carregamento da autenticação do AuthContext
  const { user, loading: loadingAuth } = useAuth();
  const [products, setProducts] = useState([]); // Estado para armazenar a lista de produtos
  const [loadingProducts, setLoadingProducts] = useState(true); // Estado para indicar se os produtos estão carregando
  const [error, setError] = useState(null); // Estado para armazenar mensagens de erro

  // Efeito para subscrever aos produtos do usuário logado
  useEffect(() => {
    let unsubscribe; // Variável para armazenar a função de unsubscribe do Firestore

    // Só tenta buscar produtos se o usuário estiver autenticado e com UID disponível
    if (user && user.uid) {
      setLoadingProducts(true); // Inicia o carregamento
      setError(null); // Limpa erros anteriores

      // Subscreve à coleção de produtos do usuário
      unsubscribe = subscribeToProducts(
        user.uid, // Passa a UID do usuário como userId
        (productsData) => {
          // Callback de sucesso: atualiza o estado com os produtos recebidos
          setProducts(productsData);
          setLoadingProducts(false); // Finaliza o carregamento
        },
        (err) => {
          // Callback de erro: define a mensagem de erro
          console.error("Erro ao carregar produtos:", err);
          setError(err.message || "Ocorreu um erro ao carregar os produtos.");
          setLoadingProducts(false); // Finaliza o carregamento
        }
      );
    } else if (!loadingAuth) {
      // Se não há usuário logado e a autenticação terminou de carregar, limpa os produtos
      setProducts([]);
      setLoadingProducts(false);
      setError(null); // Garante que não haja erro se apenas deslogou
    }

    // Função de limpeza: cancela a inscrição quando o componente é desmontado ou dependências mudam
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user, loadingAuth]); // Dependências: re-executa o efeito se o usuário ou o status de carregamento da autenticação mudar

  // Função para adicionar um novo produto
  const handleAddProduct = useCallback(async (productData) => {
    if (!user) {
      setError("Usuário não autenticado para adicionar produto.");
      throw new Error("Usuário não autenticado.");
    }
    setError(null); // Limpa erros anteriores
    try {
      await addProduct(user.uid, productData); // Chama o serviço para adicionar produto
    } catch (err) {
      console.error("Erro ao adicionar produto:", err);
      setError(err.message || "Erro ao adicionar produto.");
      throw err; // Re-lança o erro para que o componente chamador possa lidar com ele
    }
  }, [user]); // Dependência: re-cria a função se o usuário mudar

  // Função para obter detalhes de um produto específico
  const handleGetProduct = useCallback(async (productId) => {
    if (!user) {
      setError("Usuário não autenticado para buscar produto.");
      throw new Error("Usuário não autenticado.");
    }
    setError(null);
    try {
      return await getProduct(user.uid, productId); // Chama o serviço para buscar produto
    } catch (err) {
      console.error("Erro ao buscar produto:", err);
      setError(err.message || "Erro ao buscar produto.");
      throw err;
    }
  }, [user]); // Dependência: re-cria a função se o usuário mudar

  // Função para atualizar um produto existente
  const handleUpdateProduct = useCallback(async (productId, newData) => {
    if (!user) {
      setError("Usuário não autenticado para atualizar produto.");
      throw new Error("Usuário não autenticado.");
    }
    setError(null);
    try {
      await updateProduct(user.uid, productId, newData); // Chama o serviço para atualizar produto
    } catch (err) {
      console.error("Erro ao atualizar produto:", err);
      setError(err.message || "Erro ao atualizar produto.");
      throw err;
    }
  }, [user]); // Dependência: re-cria a função se o usuário mudar

  // Função para deletar um produto
  const handleDeleteProduct = useCallback(async (productId) => {
    if (!user) {
      setError("Usuário não autenticado para deletar produto.");
      throw new Error("Usuário não autenticado.");
    }
    setError(null);
    try {
      await deleteProduct(user.uid, productId); // Chama o serviço para deletar produto
    } catch (err) {
      console.error("Erro ao deletar produto:", err);
      setError(err.message || "Erro ao deletar produto.");
      throw err;
    }
  }, [user]); // Dependência: re-cria a função se o usuário mudar

  // Valor do contexto que será provido para os componentes filhos
  const value = {
    products,
    loadingProducts,
    error,
    addProduct: handleAddProduct,
    getProduct: handleGetProduct,
    updateProduct: handleUpdateProduct,
    deleteProduct: handleDeleteProduct,
  };

  // Renderiza os filhos com o valor do contexto
  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};