import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

// --- IMPORT FIREBASE ---
import { db } from '../config/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

// --- WARNA SESUAI DESAIN ---
const COLORS = {
  primary: '#1A237E', // Biru Tua (Header Card)
  background: '#FFFFFF', // Background Layar Putih
  cardBg: '#DDE1F5', // Ungu Muda (Background Item List)
  success: '#00C853', // Hijau Berhasil
  danger: '#FF5252', // Merah Gagal
  textMain: '#1A237E', // Teks Biru Header
  textGrey: '#757575',
};

const ListScreen = ({ navigation }: any) => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // --- AMBIL DATA DARI FIREBASE ---
  const fetchTransactions = async () => {
    try {
      const q = query(collection(db, 'transactions'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const data = querySnapshot.docs.map((doc) => {
        const d = doc.data();
        // Konversi Timestamp Firebase ke Jam (e.g., 14:30)
        let timeString = '--:--';
        if (d.createdAt && d.createdAt.toDate) {
          const dateObj = d.createdAt.toDate();
          timeString = dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        }

        return {
          id: doc.id,
          ...d,
          timeFormatted: timeString,
        };
      });

      setTransactions(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTransactions();
    }, []),
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchTransactions();
  };

  // Format Rupiah
  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };

  // Hitung Total
  const totalRevenue = transactions.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
  const totalCount = transactions.length;

  // --- RENDER ITEM (VISUAL SESUAI GAMBAR) ---
  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.itemCard}>
      {/* Baris 1: Judul & Harga */}
      <View style={styles.rowBetween}>
        {/* Tampilkan Nama Barang Pertama atau Order ID */}
        <Text style={styles.itemName} numberOfLines={1}>
          {item.items && item.items.length > 0 ? item.items[0].name : item.orderId}
          {item.items && item.items.length > 1 ? '...' : ''}
        </Text>
        <Text style={styles.itemPrice}>{formatRupiah(item.totalAmount)}</Text>
      </View>

      {/* Baris 2: Jam & Status */}
      <View style={[styles.rowBetween, { marginTop: 8 }]}>
        <View style={styles.rowCenter}>
          <MaterialCommunityIcons name="clock-outline" size={14} color={COLORS.danger} />
          <Text style={styles.itemTime}>{item.timeFormatted || 'Baru Saja'}</Text>
        </View>

        <View style={styles.rowCenter}>
          <Ionicons name="checkmark-circle-outline" size={16} color={COLORS.success} />
          <Text style={styles.statusText}>Berhasil</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* 1. HEADER TITLE (Putih dengan Teks Biru) */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Riwayat Transaksi</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* 2. SUMMARY CARD (Biru Tua Besar) */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Penjualan</Text>
          <View style={styles.rowSummary}>
            <Text style={styles.summaryBigNumber}>{totalCount}</Text>
            <Text style={styles.summaryText}> Transaksi</Text>
          </View>

          {/* Card Footer: Date & Download */}
          <View style={styles.cardFooter}>
            <View style={styles.dateBadge}>
              <MaterialCommunityIcons name="calendar-month" size={16} color="#333" />
              <Text style={styles.dateText}> Hari ini, {new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}</Text>
            </View>

            <TouchableOpacity style={styles.downloadButton}>
              <MaterialCommunityIcons name="arrow-down" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 3. LIST ITEMS (Warna Lavender) */}
      <View style={styles.listContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={transactions}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            ListEmptyComponent={
              <View style={{ alignItems: 'center', marginTop: 50 }}>
                <Text style={{ color: '#999' }}>Belum ada data</Text>
              </View>
            }
          />
        )}
      </View>

      {/* 4. BOTTOM NAV */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <MaterialCommunityIcons name="home-outline" size={32} color="#DDE1F5" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Box')}>
          <MaterialCommunityIcons name="cube-outline" size={32} color="#DDE1F5" />
        </TouchableOpacity>

        {/* Nav Aktif */}
        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="receipt" size={32} color={COLORS.primary} />
          <View style={{ height: 3, width: 20, backgroundColor: COLORS.primary, marginTop: 2 }} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Settings')}>
          <MaterialCommunityIcons name="account-outline" size={32} color="#DDE1F5" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },

  // Summary Card (Biru)
  summaryContainer: { paddingHorizontal: 20, marginBottom: 20, marginTop: 10 },
  summaryCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  summaryLabel: { color: '#FFF', fontSize: 14, marginBottom: 5 },
  rowSummary: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 15 },
  summaryBigNumber: { fontSize: 36, fontWeight: 'bold', color: '#FFF' },
  summaryText: { fontSize: 18, color: '#FFF', fontWeight: '600' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  dateText: { fontSize: 12, color: '#333', fontWeight: 'bold', marginLeft: 5 },
  downloadButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // List Items
  listContainer: { flex: 1, paddingHorizontal: 20 },
  itemCard: {
    backgroundColor: COLORS.cardBg, // Lavender
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowCenter: { flexDirection: 'row', alignItems: 'center' },
  itemName: { fontSize: 14, fontWeight: 'bold', color: '#000', maxWidth: '70%' },
  itemPrice: { fontSize: 14, fontWeight: '500', color: '#000' },
  itemTime: { fontSize: 12, color: '#555', marginLeft: 5 },
  statusText: { fontSize: 12, fontWeight: 'bold', color: COLORS.success, marginLeft: 4 },

  // Bottom Nav
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 70,
    backgroundColor: '#DDE1F5',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 20,
  },
  navItem: { alignItems: 'center', justifyContent: 'center' },
});

export default ListScreen;
