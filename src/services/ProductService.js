import { db } from '../config/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

// Nama Koleksi
const PRODUCT_COLLECTION = "products";

// 1. Ambil Semua Produk (READ)
export const getProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, PRODUCT_COLLECTION));
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return products;
  } catch (error) {
    console.error("Error ambil produk: ", error);
    return [];
  }
};

// 2. Tambah Produk Baru (CREATE) - INI YANG PENTING
export const addProduct = async (name, price, stock, category) => {
  try {
    const data = {
      name: name,
      price: parseInt(price), // Pastikan jadi angka
      stock: parseInt(stock),
      category: category,
      // Kita pakai gambar default dulu agar tidak ribet upload file
      image: 'https://cdn-icons-png.flaticon.com/512/2927/2927347.png' 
    };

    const docRef = await addDoc(collection(db, PRODUCT_COLLECTION), data);
    console.log("Produk berhasil ditambah! ID:", docRef.id);
    return { success: true };
  } catch (error) {
    console.error("Gagal tambah produk:", error);
    return { success: false, error: error };
  }
};

// 3. (Opsional) Seed Data - Tetap disimpan buat jaga-jaga
export const seedProducts = async () => {
    // ... (Biarkan kosong atau isi logika lama jika mau)
};