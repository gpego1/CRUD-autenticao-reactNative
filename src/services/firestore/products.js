import {
  collection,
  addDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  doc,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { db, appId } from '../../config/firebase';

// Função para obter referência da coleção de produtos do usuário
const getProductsCollectionRef = (userId) => {
  if (!db) throw new Error("Firestore não está inicializado.");
  if (!userId) throw new Error("ID do usuário é obrigatório.");
  return collection(db, `artifacts/${appId}/users/${userId}/products`);
};

// Inscrição em tempo real para atualizar lista de produtos
export const subscribeToProducts = (userId, callback, onError) => {
  if (!db) {
    onError(new Error("Firestore não inicializado."));
    return () => {};
  }
  if (!userId) {
    onError(new Error("ID do usuário é obrigatório para inscrição."));
    return () => {};
  }

  const q = query(getProductsCollectionRef(userId));
  const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const products = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        products.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        callback(products);
      },
      onError
  );

  return unsubscribe;
};

// Adicionar produto
export const addProduct = async (userId, productData) => {
  if (!db) throw new Error("Firestore não inicializado.");
  if (!userId) throw new Error("ID do usuário é obrigatório.");
  if (!productData || !productData.name) throw new Error("Dados do produto inválidos.");

  const newProductData = {
    ...productData,
    criadoPor: userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const productsRef = getProductsCollectionRef(userId);
  const docRef = await addDoc(productsRef, newProductData);
  return { id: docRef.id, ...newProductData };
};

// Obter produto específico
export const getProduct = async (userId, productId) => {
  if (!db) throw new Error("Firestore não inicializado.");
  if (!userId) throw new Error("ID do usuário é obrigatório.");
  if (!productId) throw new Error("ID do produto é obrigatório.");

  const docRef = doc(getProductsCollectionRef(userId), productId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() };
};

// Atualizar produto
export const updateProduct = async (userId, productId, newData) => {
  if (!db) throw new Error("Firestore não inicializado.");
  if (!userId) throw new Error("ID do usuário é obrigatório.");
  if (!productId) throw new Error("ID do produto é obrigatório.");

  const updatedData = {
    ...newData,
    atualizadoPor: userId,
    updatedAt: serverTimestamp(),
  };

  const docRef = doc(getProductsCollectionRef(userId), productId);
  await updateDoc(docRef, updatedData);
};

// Deletar produto
export const deleteProduct = async (userId, productId) => {
  if (!db) throw new Error("Firestore não inicializado.");
  if (!userId) throw new Error("ID do usuário é obrigatório.");
  if (!productId) throw new Error("ID do produto é obrigatório.");

  const docRef = doc(getProductsCollectionRef(userId), productId);
  console.log("Tentando deletar documento:", docRef.path);

  await deleteDoc(docRef);
  console.log("Documento deletado com sucesso");
};

