import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

const isFirebaseConfigured = Object.values(firebaseConfig).every(Boolean);

let app = null;
let auth = null;
let db = null;
let storage = null;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
}

export { app, auth, db, storage, isFirebaseConfigured, signInWithEmailAndPassword, signOut };

export async function uploadProductImage(file) {
  if (!storage || !file) {
    return '';
  }

  const fileRef = ref(storage, `productos/${Date.now()}-${file.name}`);
  await uploadBytes(fileRef, file);
  return await getDownloadURL(fileRef);
}

export async function fetchProductosFromFirebase() {
  if (!db) {
    return [];
  }

  const productosRef = collection(db, 'productos');
  const productosQuery = query(productosRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(productosQuery);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data()
  }));
}

export async function saveProductoToFirebase(producto) {
  if (!db) {
    return null;
  }

  const productosRef = collection(db, 'productos');
  const docRef = await addDoc(productosRef, {
    ...producto,
    createdAt: new Date().toISOString()
  });

  return docRef.id;
}

export async function updateProductoStockInFirebase(productoId, stock) {
  if (!db) {
    return null;
  }

  const productoRef = doc(db, 'productos', productoId);
  await updateDoc(productoRef, { stock: Number(stock) });
  return true;
}

export async function updateProductoInFirebase(productoId, producto) {
  if (!db) {
    return null;
  }

  const productoRef = doc(db, 'productos', productoId);
  await updateDoc(productoRef, producto);
  return true;
}

export async function deleteProductoFromFirebase(productoId) {
  if (!db) {
    return null;
  }

  const productoRef = doc(db, 'productos', productoId);
  await deleteDoc(productoRef);
  return true;
}
