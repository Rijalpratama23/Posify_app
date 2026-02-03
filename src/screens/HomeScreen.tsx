import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  ScrollView,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import NavbarBottom from '../components/NavbarBottom';

const { width } = Dimensions.get('window');

// --- KONFIGURASI WARNA (Sesuai Desain) ---
const COLORS = {
  primary: '#1A237E',      // Biru Tua (Header & Card Bawah)
  background: '#FFFFFF',   // Background Utama Putih
  searchBg: '#E8EAF6',     // Ungu Muda pudar (Search Bar)
  accentGreen: '#00E676',  // Hijau Terang (Tombol + dan Cloud)
  textMain: '#1A237E',     // Teks Biru Tua
  textGrey: '#9FA8DA',     // Teks Abu kebiruan
  cardWhite: '#FFFFFF',
  inactiveCat: '#E8EAF6',  // Kategori tidak aktif
  activeCat: '#1A237E',    // Kategori aktif
};

// --- DUMMY DATA PRODUK ---
const PRODUCTS = [
  {
    id: '1',
    name: 'Kopi Susu',
    price: 'Rp 15.000',
    stock: 12,
    image: 'https://img.freepik.com/free-photo/cup-coffee-with-heart-drawn-foam_1286-70.jpg', // Placeholder Kopi
  },
  {
    id: '2',
    name: 'Dessert',
    price: 'Rp 25.000',
    stock: 12,
    image: 'https://img.freepik.com/free-photo/sweet-dessert-shot-glass_144627-6332.jpg', // Placeholder Kue
  },
  {
    id: '3',
    name: 'Alpucok',
    price: 'Rp 15.000',
    stock: 8,
    image: 'https://img.freepik.com/free-photo/fresh-avocado-smoothie_1339-7840.jpg', // Placeholder Jus
  },
  {
    id: '4',
    name: 'Kopi Susu',
    price: 'Rp 15.000',
    stock: 15,
    image: 'https://img.freepik.com/free-photo/cup-coffee-with-heart-drawn-foam_1286-70.jpg',
  },
];

const CATEGORIES = ['Semua', 'Makanan', 'Minuman', 'Snack'];

const HomeScreen = ({ navigation }: any) => {
  const [activeCategory, setActiveCategory] = useState('Semua');

  // --- RENDER CARD PRODUK ---
  const renderProduct = ({ item }: { item: any }) => (
    <View style={styles.cardContainer}>
      {/* Bagian Atas: Gambar (Background Putih) */}
      <View style={styles.cardImageContainer}>
        <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
      </View>

      <View style={styles.cardInfoContainer}>
        <View style={{ flex: 1 }}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>{item.price}</Text>
          <Text style={styles.productStock}>Stock : {item.stock}</Text>
        </View>
        
        {/* Tombol Plus Hijau */}
        <TouchableOpacity style={styles.addButton}>
          <MaterialCommunityIcons name="plus" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image 
            source={require('../assets/profileanimation.png')} 
            style={styles.avatar} 
          />
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.welcomeText}>John Doe</Text>
              <Text style={{ fontSize: 18, marginLeft: 5 }}>👋</Text>
            </View>
            <Text style={styles.subWelcomeText}>Ready to make sales!</Text>
          </View>
        </View>

        {/* Cloud Icon Hijau */}
        <View style={styles.cloudIconContainer}>
          <Ionicons name="cloud-upload" size={24} color="#FFF" />
        </View>
      </View>

      {/* 2. SEARCH BAR */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9FA8DA" style={{ marginRight: 10 }} />
        <TextInput 
          placeholder="Cari nama barang..." 
          placeholderTextColor="#9FA8DA"
          style={styles.searchInput}
        />
      </View>

      {/* 3. KATEGORI (Horizontal Scroll) */}
      <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {CATEGORIES.map((cat, index) => (
            <TouchableOpacity 
              key={index} 
              onPress={() => setActiveCategory(cat)}
              style={[
                styles.categoryPill, 
                activeCategory === cat ? styles.catActive : styles.catInactive
              ]}
            >
              <Text style={[
                styles.catText, 
                activeCategory === cat ? { color: '#FFF' } : { color: COLORS.textMain }
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 4. LIST PRODUK (Grid) */}
      <FlatList
        data={PRODUCTS}
        renderItem={renderProduct}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* 5. FLOATING CART (Melayang di Bawah) */}
      <View style={styles.floatingCartContainer}>
        <View style={styles.cartInfo}>
            <Text style={styles.cartText}>4 item , Rp 45.000</Text>
        </View>
        <TouchableOpacity style={styles.payButton} onPress={() => navigation.navigate('Draft')}>
            <Text style={styles.payButtonText}>Bayar</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#F5F5F5'
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textMain,
  },
  subWelcomeText: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  cloudIconContainer: {
    backgroundColor: COLORS.accentGreen,
    width: 40,
    height: 40,
    borderRadius: 20, // Bulat
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },

  // --- SEARCH ---
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.searchBg,
    marginHorizontal: 20,
    borderRadius: 30, // Capsule shape
    paddingHorizontal: 15,
    paddingVertical: 10, // Sedikit lebih tebal
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textMain,
  },

  // --- KATEGORI ---
  categoryContainer: {
    marginBottom: 20,
    paddingLeft: 20, // Agar awal scroll tidak mepet
  },
  categoryPill: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  catActive: {
    backgroundColor: COLORS.activeCat,
  },
  catInactive: {
    backgroundColor: COLORS.inactiveCat,
  },
  catText: {
    fontWeight: '600',
    fontSize: 14,
  },

  // --- PRODUCT CARD (KUNCI DESAIN) ---
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 160, // Ruang untuk floating cart & nav bar
  },
  cardContainer: {
    width: (width - 55) / 2, // 2 Kolom dengan spasi
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4, // Shadow Android
    overflow: 'hidden', // Agar border radius bawah berfungsi
  },
  cardImageContainer: {
    height: 120,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10, // Gambar sedikit rounded
  },
  cardInfoContainer: {
    backgroundColor: COLORS.primary, // Biru Tua
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 90, // Tinggi area biru
  },
  productName: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productPrice: {
    color: '#FFF',
    fontSize: 12,
    marginBottom: 4,
  },
  productStock: {
    color: '#BDC3C7', 
    fontSize: 10,
  },
  addButton: {
    backgroundColor: COLORS.accentGreen,
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },

  // --- FLOATING CART ---
  floatingCartContainer: {
    position: 'absolute',
    bottom: 90, // Di atas Bottom Nav
    left: 20,
    right: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 30, // Capsule besar
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  cartInfo: {
      flex: 1,
  },
  cartText: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: 'bold',
  },
  payButton: {
      backgroundColor: COLORS.accentGreen,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 20,
  },
  payButtonText: {
      color: '#FFF',
      fontWeight: 'bold',
      fontSize: 14,
  },

  // --- DUMMY BOTTOM NAV ---
  bottomNav: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      height: 70,
      backgroundColor: '#DDE1F5', // Ungu pudar sesuai gambar
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      elevation: 20,
  },
  navItem: {
      alignItems: 'center',
      justifyContent: 'center',
  }
});

export default HomeScreen;