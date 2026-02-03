import * as SQLite from 'expo-sqlite';

// 1. Buka Database (Otomatis membuat file posify.db di HP)
const db = SQLite.openDatabase('posify.db');

// 2. Inisialisasi Tabel (Dijalankan saat aplikasi mulai)
export const initDB = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS drafts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customerName TEXT,
        items TEXT, 
        totalPrice INTEGER,
        date TEXT
      );`,
      [],
      () => console.log('Tabel SQLite Siap!'),
      (_, error) => console.error('Gagal buat tabel:', error),
    );
  });
};

// 3. CREATE: Simpan Draft
export const saveDraft = (customerName, cartItems, totalPrice) => {
  return new Promise((resolve, reject) => {
    const itemsString = JSON.stringify(cartItems); // Array diubah jadi teks biar bisa disimpan
    const dateNow = new Date().toLocaleString();

    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO drafts (customerName, items, totalPrice, date) VALUES (?, ?, ?, ?)',
        [customerName, itemsString, totalPrice, dateNow],
        (_, result) => resolve(result),
        (_, error) => reject(error),
      );
    });
  });
};

// 4. READ: Ambil Semua Draft
export const getDrafts = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM drafts ORDER BY id DESC',
        [],
        (_, { rows: { _array } }) => resolve(_array),
        (_, error) => reject(error),
      );
    });
  });
};

// 5. DELETE: Hapus Draft (Kalau sudah dibayar/batal)
export const deleteDraft = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM drafts WHERE id = ?',
        [id],
        (_, result) => resolve(result),
        (_, error) => reject(error),
      );
    });
  });
};
