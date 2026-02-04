import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

// --- IMPORT DATABASE SQLITE ---
import { getDrafts, deleteDraft } from '../services/localDB';

// WARNA (Style Senada tapi Aksen Oranye untuk Pembeda)
const COLORS = {
  primary: '#1A237E', // Biru Tua (Nav & Header)
  accent: '#FF9800', // Oranye (Khas Pending/Draft)
  background: '#FFFFFF',
  cardBg: '#FFF3E0', // Oranye Muda Pudar (Background Item)
  danger: '#FF5252',
  textMain: '#1A237E',
  textGrey: '#757575',
};

const BoxScreen = ({ navigation }: any) => {
  const [drafts, setDrafts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. AMBIL DATA DARI SQLITE (READ)
  const loadDrafts = async () => {
    setLoading(true);
    try {
      const data = await getDrafts();
      setDrafts(data);
    } catch (error) {
      console.error('Gagal load draft:', error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh otomatis saat masuk ke halaman ini
  useFocusEffect(
    useCallback(() => {
      loadDrafts();
    }, []),
  );

  // 2. HAPUS DRAFT (DELETE)
  const handleDelete = (id: number) => {
    Alert.alert('Hapus Data', 'Yakin ingin menghapus pending order ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          await deleteDraft(id);
          loadDrafts(); // Refresh list setelah hapus
        },
      },
    ]);
  };

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };

  // RENDER ITEM (Desain mirip History tapi nuansa Oranye)
  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.itemCard}>
      {/* Baris 1: Nama Pelanggan & Total */}
      <View style={styles.rowBetween}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons name="account-clock" size={20} color={COLORS.accent} />
          <Text style={styles.customerName}>{item.customerName}</Text>
        </View>
        <Text style={styles.itemPrice}>{formatRupiah(item.totalPrice)}</Text>
      </View>

      {/* Baris 2: Tanggal & Tombol Aksi */}
      <View style={[styles.rowBetween, { marginTop: 10 }]}>
        <Text style={styles.dateText}>{item.date}</Text>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          {/* Tombol Hapus */}
          <TouchableOpacity style={styles.btnDelete} onPress={() => handleDelete(item.id)}>
            <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pending Orders</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{drafts.length}</Text>
        </View>
      </View>

      {/* SUMMARY INFO (Kuning Oranye) */}
      <View style={styles.infoContainer}>
        <View style={styles.infoCard}>
          <MaterialCommunityIcons name="database-sync" size={24} color={COLORS.accent} />
          <View style={{ marginLeft: 15, flex: 1 }}>
            <Text style={styles.infoTitle}>Penyimpanan Lokal (Offline)</Text>
            <Text style={styles.infoDesc}>Data ini hanya tersimpan di HP ini, belum masuk ke laporan cloud.</Text>
          </View>
        </View>
      </View>

      {/* LIST DRAFTS */}
      <View style={styles.listContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={drafts}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={{ alignItems: 'center', marginTop: 80 }}>
                <MaterialCommunityIcons name="package-variant-closed" size={60} color="#DDD" />
                <Text style={{ color: '#999', marginTop: 10 }}>Tidak ada pending order</Text>
              </View>
            }
          />
        )}
      </View>

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <MaterialCommunityIcons name="home-outline" size={32} color="#DDE1F5" />
        </TouchableOpacity>

        {/* Nav Aktif (Cube) */}
        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="cube" size={32} color={COLORS.primary} />
          <View style={{ height: 3, width: 20, backgroundColor: COLORS.primary, marginTop: 2 }} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Draft')}>
          <MaterialCommunityIcons name="receipt" size={32} color="#DDE1F5" />
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
    paddingVertical: 15,
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.primary },
  badge: { backgroundColor: COLORS.accent, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  badgeText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },

  // Info Card
  infoContainer: { paddingHorizontal: 20, marginBottom: 15 },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  infoTitle: { fontWeight: 'bold', color: '#F57C00', fontSize: 14 },
  infoDesc: { color: '#777', fontSize: 12, marginTop: 2 },

  // List
  listContainer: { flex: 1, paddingHorizontal: 20 },
  itemCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 5,
    borderLeftColor: COLORS.accent, // Aksen garis oranye di kiri
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  customerName: { fontSize: 16, fontWeight: 'bold', color: '#333', marginLeft: 8 },
  itemPrice: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary },
  dateText: { fontSize: 12, color: '#888' },

  btnDelete: { padding: 8, backgroundColor: '#FFEBEE', borderRadius: 8 },

  // Nav
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

export default BoxScreen;
