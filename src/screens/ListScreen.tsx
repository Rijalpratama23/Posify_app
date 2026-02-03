import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';

// --- KONFIGURASI WARNA (Sesuai Screenshot) ---
const COLORS = {
  primary: '#1A237E', // Biru Tua (Header Card & Text)
  background: '#FFFFFF', // Background Putih
  cardBg: '#DDE1F5', // Background Item List (Lavender Pudar)
  success: '#00C853', // Hijau (Berhasil)
  danger: '#FF5252', // Merah (Gagal)
  textMain: '#000000', // Hitam untuk Judul Item
  textGrey: '#757575', // Abu-abu untuk Jam
  white: '#FFFFFF',
  bottomNavBg: '#DDE1F5', // Background Navigasi Bawah
};

// --- DUMMY DATA TRANSAKSI ---
const TRANSACTIONS = [
  {
    id: '1',
    name: 'Jenis Transaksi/nama barang',
    time: '14:30',
    amount: 'Rp 45.000',
    status: 'success', // success atau failed
  },
  {
    id: '2',
    name: 'Jenis Transaksi/nama barang',
    time: '14:30',
    amount: 'Rp 45.000',
    status: 'failed',
  },
  {
    id: '3',
    name: 'Jenis Transaksi/nama barang',
    time: '14:30',
    amount: 'Rp 45.000',
    status: 'success',
  },
  {
    id: '4',
    name: 'Jenis Transaksi/nama barang',
    time: '14:30',
    amount: 'Rp 45.000',
    status: 'success',
  },
  {
    id: '5',
    name: 'Jenis Transaksi/nama barang',
    time: '12:15',
    amount: 'Rp 120.000',
    status: 'success',
  },
];

const HistoryScreen = ({ navigation }: any) => {
  // --- RENDER ITEM LIST ---
  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.itemCard}>
      {/* Baris Atas: Nama Barang & Harga */}
      <View style={styles.rowBetween}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>{item.amount}</Text>
      </View>

      {/* Baris Bawah: Jam & Status */}
      <View style={[styles.rowBetween, { marginTop: 8 }]}>
        {/* Jam */}
        <View style={styles.rowCenter}>
          <MaterialCommunityIcons name="clock-outline" size={16} color={COLORS.danger} style={{ marginRight: 4 }} />
          {/* Catatan: Di gambar ikon jam-nya merah muda/oranye, saya pakai danger/red biar mirip */}
          <Text style={styles.itemTime}>{item.time}</Text>
        </View>

        {/* Status Badge */}
        <View style={styles.rowCenter}>
          {item.status === 'success' ? (
            <>
              <Ionicons name="checkmark-circle-outline" size={18} color={COLORS.success} />
              <Text style={[styles.statusText, { color: COLORS.success }]}> Berhasil</Text>
            </>
          ) : (
            <>
              <Ionicons name="close-circle-outline" size={18} color={COLORS.danger} />
              <Text style={[styles.statusText, { color: COLORS.danger }]}> Gagal</Text>
            </>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* 1. HEADER ATAS (Back Button & Title) */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Riwayat Transaksi</Text>
        <View style={{ width: 40 }} /> {/* Dummy view biar title di tengah */}
      </View>

      {/* 2. SUMMARY CARD (Kotak Biru Besar) */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Penjualan</Text>
          <View style={styles.rowSummary}>
            <Text style={styles.summaryBigNumber}>32</Text>
            <Text style={styles.summaryText}> Traksaksi</Text>
          </View>

          {/* Baris Bawah Card: Tanggal & Download */}
          <View style={styles.cardFooter}>
            <View style={styles.dateBadge}>
              <MaterialCommunityIcons name="calendar-month" size={16} color="#333" />
              <Text style={styles.dateText}> Hari ini, 03 Feb 2026</Text>
            </View>

            <TouchableOpacity style={styles.downloadButton}>
              <MaterialCommunityIcons name="arrow-down" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 3. LIST TRANSAKSI */}
      <FlatList data={TRANSACTIONS} renderItem={renderItem} keyExtractor={(item) => item.id} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false} />

      {/* 4. BOTTOM NAVIGATION (Visual Dummy) */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <MaterialCommunityIcons name="home-outline" size={30} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Box')}>
          {' '}
          {/* Ganti jika ada screen Box */}
          <MaterialCommunityIcons name="cube-outline" size={30} color="#FFF" />
        </TouchableOpacity>
        {/* Ikon Aktif (Struk) */}
        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="receipt" size={30} color={COLORS.primary} />
          {/* Garis bawah biru tua untuk indikator aktif */}
          <View style={{ height: 3, width: 20, backgroundColor: COLORS.primary, marginTop: 2 }} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Settings')}>
          <MaterialCommunityIcons name="account-outline" size={30} color="#FFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  // --- HEADER ---
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },

  // --- SUMMARY CARD (BIRU) ---
  summaryContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
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
  summaryLabel: {
    color: '#FFF',
    fontSize: 14,
    marginBottom: 5,
  },
  rowSummary: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 15,
  },
  summaryBigNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
  },
  summaryText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  dateText: {
    fontSize: 12,
    color: '#333',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  downloadButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // --- LIST ITEM ---
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Ruang untuk bottom nav
  },
  itemCard: {
    backgroundColor: COLORS.cardBg, // Warna Lavender Pudar
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    // Shadow Halus
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTime: {
    fontSize: 12,
    color: '#555', // Warna abu agak gelap
    marginLeft: 5,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },

  // --- BOTTOM NAV ---
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: COLORS.bottomNavBg,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: 60,
  },
});

export default HistoryScreen;
