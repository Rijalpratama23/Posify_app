import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyA-iytNqYLrAbK0JA_TNnlD4vJFFUxZQbg',
  authDomain: 'posify-8b69f.firebaseapp.com',
  projectId: 'posify-8b69f',
  storageBucket: 'posify-8b69f.firebasestorage.app',
  messagingSenderId: '414331570792',
  appId: '1:414331570792:web:1f1672bc87ac86f22049dd',
  measurementId: 'G-6WFEGVV6GX',
};

const app = initializeApp(firebaseConfig);

// Export Auth agar bisa dipakai Login & Register
export const auth = getAuth(app);
export const db = getFirestore(app);
