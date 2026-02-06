import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Nama Koleksi di Database Firebase
const TRANSACTION_COLLECTION = 'transactions';

// Fungsi Simpan Transaksi
export const saveTransaction = async (cartItems, totalAmount, paymentMethod = 'Cash') => {
  try {
    // 1. Siapkan Data yang mau disimpan
    const transactionData = {
      orderId: `ORD-${Date.now()}`, // ID Unik berdasarkan waktu
      items: cartItems, // Barang yang dibeli
      totalAmount: totalAmount, // Total Harga
      paymentMethod: paymentMethod, 
      status: 'success', 
      createdAt: serverTimestamp(), 
      dateLabel: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
    };

    // 2. Kirim ke Firebase Firestore
    const docRef = await addDoc(collection(db, TRANSACTION_COLLECTION), transactionData);

    console.log('Transaksi Berhasil Disimpan! ID:', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Gagal simpan transaksi:', error);
    return { success: false, error: error.message };
  }
};
