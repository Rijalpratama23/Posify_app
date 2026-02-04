import * as SQLite from 'expo-sqlite';

let db;

// 1. Inisialisasi Database (Pakai Tabel Baru 'pending_orders')
export const initDB = async () => {
  try {
    db = await SQLite.openDatabaseAsync('posify.db');

    // Buat Tabel Baru (pending_orders)
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS pending_orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customerName TEXT NOT NULL,
        items TEXT NOT NULL,
        totalPrice INTEGER NOT NULL,
        date TEXT NOT NULL
      );
    `);
    console.log('✅ Database SQLite Siap! Tabel: pending_orders');
  } catch (error) {
    console.error('❌ Gagal Inisialisasi DB:', error);
  }
};

// 2. CREATE: Simpan Draft
export const saveDraft = async (customerName, cartItems, totalPrice) => {
  if (!db) await initDB();

  try {
    const itemsString = JSON.stringify(cartItems);
    const dateNow = new Date().toLocaleString();

    console.log('💾 Sedang menyimpan ke SQLite...');

    const result = await db.runAsync('INSERT INTO pending_orders (customerName, items, totalPrice, date) VALUES (?, ?, ?, ?)', customerName, itemsString, totalPrice, dateNow);

    console.log('✅ Berhasil Simpan! ID:', result.lastInsertRowId);
    return result;
  } catch (error) {
    console.error('❌ Gagal Simpan Draft:', error);
    throw error;
  }
};

// 3. READ: Ambil Semua Draft
export const getDrafts = async () => {
  if (!db) await initDB();

  try {
    console.log('📂 Mengambil data dari SQLite...');
    const allRows = await db.getAllAsync('SELECT * FROM pending_orders ORDER BY id DESC');

    console.log(`✅ Ditemukan ${allRows.length} data draft.`);
    return allRows;
  } catch (error) {
    console.error('❌ Gagal Ambil Draft:', error);
    return [];
  }
};

// 4. DELETE: Hapus Draft
export const deleteDraft = async (id) => {
  if (!db) await initDB();
  await db.runAsync('DELETE FROM pending_orders WHERE id = ?', id);
  console.log('🗑️ Draft dihapus ID:', id);
};
