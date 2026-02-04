import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Image,
  FlatList, Dimensions, ScrollView, StatusBar, ActivityIndicator, Alert, Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native'; 

import { auth } from '../config/firebase'; 
import { saveDraft } from '../services/localDB';
import { saveTransaction } from '../services/transactionService'; 
import { getProducts, addProduct } from '../services/ProductService'; // Import addProduct

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#1A237E',
  background: '#FFFFFF',
  searchBg: '#E8EAF6',
  accentGreen: '#00E676',
  textMain: '#1A237E',
  textGrey: '#9FA8DA',
  activeCat: '#1A237E',
  inactiveCat: '#E8EAF6',
  orange: '#FF9800', 
};

const CATEGORIES = ['Semua', 'Makanan', 'Minuman', 'Snack'];

const HomeScreen = ({ navigation }: any) => {
  const isFocused = useIsFocused();
  const user = auth.currentUser; 

  // --- STATE UTAMA ---
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<any[]>([]);

  // --- MODAL SIMPAN DRAFT ---
  const [modalVisible, setModalVisible] = useState(false);
  const [customerName, setCustomerName] = useState('');

  // --- MODAL TAMBAH PRODUK (BARU) ---
  const [addProductModal, setAddProductModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newStock, setNewStock] = useState('');
  const [newCategory, setNewCategory] = useState('Makanan');

  useEffect(() => {
    if (isFocused) fetchData();
  }, [isFocused]);

  const fetchData = async () => {
    setIsLoading(true);
    const data = await getProducts();
    setProducts(data);
    setFilteredProducts(data);
    setIsLoading(false);
  };

  useEffect(() => {
    let result = products;
    if (activeCategory !== 'Semua') {
      result = result.filter(item => item.category === activeCategory);
    }
    if (searchQuery) {
      result = result.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    setFilteredProducts(result);
  }, [activeCategory, searchQuery, products]);

  // --- LOGIC KERANJANG ---
  const addToCart = (product: any) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      } else {
        return [...prevCart, { ...product, qty: 1 }];
      }
    });
  };

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const formatRupiah = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  // --- CHECKOUT ---
  const handleCheckout = async () => {
    if (cart.length === 0) return;
    Alert.alert("Memproses", "Menyimpan transaksi...");
    const result = await saveTransaction(cart, totalPrice); 
    if (result.success) {
      Alert.alert("Sukses", "Transaksi berhasil!", [{ text: "OK", onPress: () => { setCart([]); navigation.navigate('Draft'); }}]);
    } else {
      Alert.alert("Gagal", "Cek koneksi internet.");
    }
  };

  // --- SIMPAN DRAFT (SQLITE) ---
  const openSaveModal = () => { if (cart.length > 0) { setCustomerName(''); setModalVisible(true); } };
  const processSaveDraft = async () => {
    try {
        setModalVisible(false);
        await saveDraft(customerName.trim() || "Umum", cart, totalPrice);
        setTimeout(() => { Alert.alert("Tersimpan!", "Masuk ke Box (Offline).", [{ text: "OK", onPress: () => { setCart([]); navigation.navigate('Box'); }}]); }, 500);
    } catch (e) { Alert.alert("Error", "Gagal simpan SQLite."); }
  };

  // --- TAMBAH PRODUK BARU (FIREBASE) ---
  const handleAddProduct = async () => {
    if (!newName || !newPrice || !newStock) {
        Alert.alert("Peringatan", "Mohon isi semua data!");
        return;
    }
    setAddProductModal(false);
    setIsLoading(true); // Loading sebentar

    const res = await addProduct(newName, newPrice, newStock, newCategory);
    if (res.success) {
        Alert.alert("Sukses", "Produk berhasil ditambahkan ke Menu!");
        // Reset Form
        setNewName(''); setNewPrice(''); setNewStock('');
        fetchData(); // Refresh data biar muncul
    } else {
        Alert.alert("Gagal", "Terjadi kesalahan sistem.");
        setIsLoading(false);
    }
  };

  const renderProduct = ({ item }: { item: any }) => (
    <View style={styles.cardContainer}>
      <View style={styles.cardImageContainer}>
        <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
      </View>
      <View style={styles.cardInfoContainer}>
        <View style={{ flex: 1 }}>
          <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.productPrice}>{formatRupiah(item.price)}</Text>
          <Text style={styles.productStock}>Stok: {item.stock}</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item)}>
          <MaterialCommunityIcons name="plus" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={require('../assets/profileanimation.png')} style={styles.avatar} />
          <View>
            <Text style={styles.welcomeText}>{user?.displayName || 'Halo, Kasir!'}</Text>
            <Text style={styles.subWelcomeText}>Siap berjualan hari ini?</Text>
          </View>
        </View>
        {/* Tombol Tambah Produk (Ganti ikon awan jadi Plus Kotak) */}
        <TouchableOpacity style={styles.cloudIconContainer} onPress={() => setAddProductModal(true)}>
          <MaterialCommunityIcons name="plus-box" size={28} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* SEARCH */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9FA8DA" style={{ marginRight: 10 }} />
        <TextInput placeholder="Cari nama barang..." placeholderTextColor="#9FA8DA" style={styles.searchInput} value={searchQuery} onChangeText={setSearchQuery} />
      </View>

      {/* CATEGORIES */}
      <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {CATEGORIES.map((cat, index) => (
            <TouchableOpacity key={index} onPress={() => setActiveCategory(cat)} style={[styles.categoryPill, activeCategory === cat ? styles.catActive : styles.catInactive]}>
              <Text style={[styles.catText, activeCategory === cat ? { color: '#FFF' } : { color: COLORS.textMain }]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* LIST PRODUCT */}
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{ marginTop: 10, color: COLORS.textGrey }}>Memuat data...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts} renderItem={renderProduct} keyExtractor={item => item.id}
          numColumns={2} columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 50 }}>
              <Text style={{ color: COLORS.textGrey }}>Belum ada produk.</Text>
              <Text style={{ color: COLORS.textGrey, fontSize: 12 }}>Klik tombol (+) di atas untuk tambah barang.</Text>
            </View>
          }
        />
      )}

      {/* FLOATING CART */}
      {totalItems > 0 && (
        <View style={styles.floatingCartContainer}>
          <View style={styles.cartInfo}>
              <Text style={styles.cartText}>{totalItems} item , {formatRupiah(totalPrice)}</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity style={[styles.payButton, { backgroundColor: COLORS.orange, paddingHorizontal: 15 }]} onPress={openSaveModal}>
                <MaterialCommunityIcons name="content-save" size={20} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.payButton} onPress={handleCheckout}>
                <Text style={styles.payButtonText}>Bayar ></Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* --- MODAL 1: INPUT NAMA PELANGGAN (OFFLINE) --- */}
      <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Simpan Draft (Offline)</Text>
            <TextInput style={styles.modalInput} placeholder="Nama Pelanggan" value={customerName} onChangeText={setCustomerName} />
            <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.modalBtn, {backgroundColor: '#EEE'}]} onPress={() => setModalVisible(false)}><Text>Batal</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.modalBtn, {backgroundColor: COLORS.orange}]} onPress={processSaveDraft}><Text style={{color:'#FFF', fontWeight:'bold'}}>Simpan</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* --- MODAL 2: TAMBAH PRODUK BARU (FIREBASE) --- */}
      <Modal animationType="slide" transparent={true} visible={addProductModal} onRequestClose={() => setAddProductModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { height: 400 }]}> 
            <Text style={styles.modalTitle}>Tambah Menu Baru</Text>
            <Text style={styles.modalSubtitle}>Data akan disimpan ke Cloud (Firebase).</Text>
            
            <TextInput style={styles.inputBox} placeholder="Nama Produk (Misal: Nasi Goreng)" value={newName} onChangeText={setNewName} />
            <View style={{flexDirection:'row', gap: 10}}>
                <TextInput style={[styles.inputBox, {flex:1}]} placeholder="Harga (Rp)" value={newPrice} onChangeText={setNewPrice} keyboardType="numeric" />
                <TextInput style={[styles.inputBox, {flex:1}]} placeholder="Stok Awal" value={newStock} onChangeText={setNewStock} keyboardType="numeric" />
            </View>

            {/* Pilihan Kategori Sederhana */}
            <View style={{flexDirection:'row', marginVertical: 10, gap: 5}}>
                {['Makanan', 'Minuman'].map(c => (
                    <TouchableOpacity key={c} onPress={()=>setNewCategory(c)} style={[styles.catSmall, newCategory===c ? {backgroundColor: COLORS.primary} : {backgroundColor: '#EEE'}]}>
                        <Text style={{color: newCategory===c?'#FFF':'#333'}}>{c}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={[styles.modalButtons, {marginTop: 20}]}>
                <TouchableOpacity style={[styles.modalBtn, {backgroundColor: '#EEE'}]} onPress={() => setAddProductModal(false)}><Text>Batal</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.modalBtn, {backgroundColor: COLORS.accentGreen}]} onPress={handleAddProduct}><Text style={{color:'#FFF', fontWeight:'bold'}}>+ Tambah</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      <View style={{height: 80}} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, marginBottom: 20 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12, borderWidth: 2, borderColor: '#F5F5F5' },
  welcomeText: { fontSize: 18, fontWeight: 'bold', color: COLORS.textMain },
  subWelcomeText: { fontSize: 12, color: '#9E9E9E' },
  cloudIconContainer: { backgroundColor: COLORS.accentGreen, width: 45, height: 45, borderRadius: 15, justifyContent: 'center', alignItems: 'center', elevation: 3 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.searchBg, marginHorizontal: 20, borderRadius: 30, paddingHorizontal: 15, paddingVertical: 10, marginBottom: 20 },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.textMain },
  categoryContainer: { marginBottom: 20, paddingLeft: 20 },
  categoryPill: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, marginRight: 10 },
  catActive: { backgroundColor: COLORS.activeCat },
  catInactive: { backgroundColor: COLORS.inactiveCat },
  catText: { fontWeight: '600', fontSize: 14 },
  listContent: { paddingHorizontal: 20, paddingBottom: 160 },
  cardContainer: { width: (width - 55) / 2, backgroundColor: 'white', borderRadius: 15, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 4, overflow: 'hidden' },
  cardImageContainer: { height: 120, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', padding: 10 },
  cardImage: { width: '100%', height: '100%', borderRadius: 10 },
  cardInfoContainer: { backgroundColor: COLORS.primary, padding: 12, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 90 },
  productName: { color: '#FFF', fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
  productPrice: { color: '#FFF', fontSize: 12, marginBottom: 4 },
  productStock: { color: '#BDC3C7', fontSize: 10 },
  addButton: { backgroundColor: COLORS.accentGreen, width: 35, height: 35, borderRadius: 17.5, justifyContent: 'center', alignItems: 'center', marginBottom: 5 },
  floatingCartContainer: { position: 'absolute', bottom: 90, left: 20, right: 20, backgroundColor: COLORS.primary, borderRadius: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, paddingHorizontal: 20, elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3, shadowRadius: 5 },
  cartInfo: { flex: 1 },
  cartText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  payButton: { backgroundColor: COLORS.accentGreen, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  payButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  
  // MODAL STYLES
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: '#FFF', borderRadius: 20, padding: 20, elevation: 5 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary, marginBottom: 5 },
  modalSubtitle: { fontSize: 12, color: '#777', marginBottom: 15 },
  modalInput: { borderWidth: 1, borderColor: '#DDD', borderRadius: 10, padding: 10, marginBottom: 20, fontSize: 16 },
  inputBox: { borderWidth: 1, borderColor: '#DDD', borderRadius: 10, padding: 10, marginBottom: 10, fontSize: 16 },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  modalBtn: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  catSmall: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
});

export default HomeScreen;