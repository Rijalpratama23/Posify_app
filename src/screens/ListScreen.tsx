import React from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Dimensions, StatusBar, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// --- KONFIGURASI WARNA & GAMBAR ---
const COLORS = {
  primary: '#1A237E', // Biru Tua (Header & Icon Aktif)
  accent: '#00E676', // Hijau Terang (FAB & Icon Stats)
  background: '#FFFFFF', // Putih
  navBackground: '#C5CAE9', // Ungu Muda (Background Navbar)
  textDark: '#333333',
  cardShadow: '#B0B0B0',
};

// Dummy Data untuk List Makanan
const DATA = [
  { id: '1', title: 'Total Item', stock: 12, image: 'https://img.freepik.com/free-photo/seblak-indonesian-spicy-soup-with-crackers_1150-37735.jpg' }, // Gambar Seblak/Sup
  { id: '2', title: 'Total Item', stock: 12, image: 'https://img.freepik.com/free-photo/seblak-indonesian-spicy-soup-with-crackers_1150-37735.jpg' },
  { id: '3', title: 'Total Item', stock: 12, image: 'https://img.freepik.com/free-photo/seblak-indonesian-spicy-soup-with-crackers_1150-37735.jpg' },
  { id: '4', title: 'Total Item', stock: 12, image: 'https://img.freepik.com/free-photo/seblak-indonesian-spicy-soup-with-crackers_1150-37735.jpg' },
  { id: '5', title: 'Total Item', stock: 12, image: 'https://img.freepik.com/free-photo/seblak-indonesian-spicy-soup-with-crackers_1150-37735.jpg' },
];

const InventoryScreen = () => {
  // Render Item List
  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemStock}>Stock: {item.stock}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* 1. HEADER BIRU */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Posify</Text>
      </View>

      {/* 2. STATS CARDS (Overlapping) */}
      <View style={styles.statsContainer}>
        {/* Card 1: Total Item */}
        <View style={styles.statCard}>
          <View style={styles.iconCircle}>
            <Feather name="check" size={20} color={COLORS.accent} />
          </View>
          <Text style={styles.statLabel}>Total Item</Text>
        </View>

        {/* Card 2: Low Stock */}
        <View style={styles.statCard}>
          <View style={styles.iconCircle}>
            <Feather name="download" size={20} color={COLORS.accent} />
          </View>
          <Text style={styles.statLabel}>Low Stock</Text>
        </View>
      </View>

      {/* 3. LIST ITEMS */}
      <FlatList data={DATA} renderItem={renderItem} keyExtractor={(item) => item.id} contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false} />

      {/* 4. FLOATING ACTION BUTTON (FAB) */}
      <TouchableOpacity style={styles.fab}>
        <MaterialCommunityIcons name="plus" size={32} color="#FFF" />
      </TouchableOpacity>

      {/* 5. CUSTOM NAVBAR BOTTOM */}
      <View style={styles.navbar}>
        {/* Home */}
        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="home" size={30} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Inventory (Aktif) */}
        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="cube" size={32} color={COLORS.primary} />
        </TouchableOpacity>

        {/* Receipt/Orders */}
        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="receipt" size={30} color="#FFFFFF" />
        </TouchableOpacity>

        {/* User/Profile */}
        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="account" size={30} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // --- HEADER ---
  headerContainer: {
    backgroundColor: COLORS.primary,
    height: 140, // Tinggi header biru
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 50,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },

  // --- STATS CARDS ---
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: -40, // Teknik overlapping (naik ke atas header biru)
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#FFF',
    width: '47%',
    borderRadius: 15,
    padding: 15,
    elevation: 4, // Shadow Android
    shadowColor: '#000', // Shadow iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconCircle: {
    marginBottom: 8,
    // Ikon hanya berupa warna hijau tanpa lingkaran background di gambar referensi,
    // tapi kita beri container agar rapi
    alignSelf: 'flex-start',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    padding: 2,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },

  // --- LIST ITEMS ---
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Ruang agar item terbawah tidak tertutup Navbar
  },
  itemCard: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    overflow: 'hidden', 
    alignItems: 'center',
  },
  itemImage: {
    width: 90,
    height: 90,
    resizeMode: 'cover',
  },
  itemContent: {
    flex: 1,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  itemStock: {
    fontSize: 13,
    color: '#555',
  },

  // --- FLOATING ACTION BUTTON ---
  fab: {
    position: 'absolute',
    bottom: 100, // Di atas Navbar
    right: 20,
    backgroundColor: COLORS.accent,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 10,
  },

  // --- NAVBAR BOTTOM ---
  navbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: COLORS.navBackground, // Warna ungu muda
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 10, // Menyesuaikan ikon agar agak ke tengah
    elevation: 0,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
});

export default InventoryScreen;
