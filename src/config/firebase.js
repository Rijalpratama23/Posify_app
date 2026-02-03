import { initializeApp } from 'firebase/app';
// Kita pakai initializeAuth agar bisa setting penyimpanan (Persistence)
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyA-iytNqYLrAbK0JA_TNnlD4vJFFUxZQbg',
  authDomain: 'posify-8b69f.firebaseapp.com',
  projectId: 'posify-8b69f',
  storageBucket: 'posify-8b69f.firebasestorage.app',
  messagingSenderId: '414331570792',
  appId: '1:414331570792:web:1f1672bc87ac86f22049dd',
  measurementId: 'G-6WFEGVV6GX',
};

// 1. Inisialisasi App
const app = initializeApp(firebaseConfig);

// 2. Inisialisasi Auth Khusus React Native (Android/iOS)
// Ini kuncinya agar tidak error "getReactNativePersistence is not a function"
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// 3. Export
export { auth };
export const db = getFirestore(app);
