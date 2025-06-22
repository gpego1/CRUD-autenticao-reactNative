import { collection, addDoc, getDoc, updateDoc, deleteDoc, onSnapshot, doc, query, serverTimestamp } from 'firebase/firestore'; // Importe serverTimestamp
import { db, appId } from '../../config/firebase';

const getProductsCollectionRef = (userId) => {
  if (!db || !userId) {
    throw new Error("Firestore ou ID do usuário não disponível.");
  }
  return collection(db, `artifacts/${appId}/users/${userId}/products`);
};

export const subscribeToProducts = (userId, callback, onError) => {
  if (!db || !userId) {
    onError(new Error("Firestore ou ID do usuário não disponível para inscrição."));
    return () => {};
  }

  const q = query(getProductsCollectionRef(userId));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const productList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    productList.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    callback(productList);
  }, onError);

  return unsubscribe;
};

export const addProduct = async (userId, productData) => {
  if (!db || !userId) { throw new Error("Firestore ou ID do usuário não disponível."); }

  const newProductData = {
    ...productData,
    criadoPor: userId,
    createdAt: serverTimestamp(), // Usa o timestamp do servidor
  };
  return await addDoc(getProductsCollectionRef(userId), newProductData);
};

export const getProduct = async (userId, productId) => {
  if (!db || !userId || !productId) { throw new Error("Firestore, ID do usuário ou ID do produto não disponível."); }
  const docRef = doc(getProductsCollectionRef(userId), productId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

// Modifique a função updateProduct
export const updateProduct = async (userId, productId, newData) => {
  if (!db || !userId || !productId) { throw new Error("Firestore, ID do usuário ou ID do produto não disponível."); }

  // Adiciona os novos campos 'atualizadoPor' e 'updatedAt'
  const updatedData = {
    ...newData,
    atualizadoPor: userId,
    updatedAt: serverTimestamp(), // Usa o timestamp do servidor
  };
  const docRef = doc(getProductsCollectionRef(userId), productId);
  return await updateDoc(docRef, updatedData);
};

export const deleteProduct = async (userId, productId) => {
  if (!db || !userId || !productId) { throw new Error("Firestore, ID do usuário ou ID do produto não disponível."); }
  const docRef = doc(getProductsCollectionRef(userId), productId);
  return await deleteDoc(docRef);
};