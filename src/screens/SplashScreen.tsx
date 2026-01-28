import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mendapatkan ukuran layar HP
const { width, height } = Dimensions.get('window');

// Palet Warna Sesuai Desain
const COLORS = {
  background: '#DDE1F5', // Warna Background Lavender/Biru Muda
  primary: '#1A237E', // Deep Navy (Tombol & Judul)
  textMain: '#1A237E', // Warna Teks Judul
  textSub: '#4F5E7B', // Warna Teks Deskripsi (Abu kebiruan)
  white: '#FFFFFF',
  buttonShadow: '#000000',
};

// Ganti 'any' dengan tipe navigasi jika sudah setup TypeScript definition
const SplashScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.contentContainer}>
        <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />

        {/* 2. Ilustrasi Kasir */}
        <Image source={require('../assets/splash.png')} style={styles.illustration} resizeMode="contain" />

        {/* 3. Teks Copywriting */}
        <View style={styles.textWrapper}>
          <Text style={styles.title}>Welcome to Posify!</Text>

          <Text style={styles.subtitle}>Catat Offline, Pantau Online</Text>

          <Text style={styles.description}>Dirancang khusus untuk mempercepat operasional harian toko Anda. Proses pesanan pelanggan tanpa loading internet yang mengganggu,</Text>
        </View>
      </View>

      {/* Bagian Tombol (Bawah) */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={() => navigation.replace('Login')} // Pindah ke Login
        >
          <Text style={styles.buttonText}>Get Started</Text>
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
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 20,
    margin: 12,
  },
  logo: {
    width: 240,
    height: 195,
    marginTop: 80,
    borderRadius: 400,
  },
  illustration: {
    width: width * 0.9, // Lebar 80% dari layar
    height: 210, // Tinggi proporsional
    marginBottom: 10,
    borderRadius: 300,
  },
  // Wrapper Teks
  textWrapper: {
    alignItems: 'center',
    marginTop: 10,
    padding: 10,
    marginBottom: 40,
    height: 270,
  },
  // Judul Besar
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textMain,
    textAlign: 'center',
    marginBottom: 8,
  },
  // Sub-judul (Tagline)
  subtitle: {
    fontSize: 16,
    fontWeight: 'semibold', // Semi-bold
    color: COLORS.textSub,
    textAlign: 'center',
    marginBottom: 20,
  },
  // Paragraf Panjang
  description: {
    fontSize: 15,
    color: COLORS.textSub,
    textAlign: 'center',
    lineHeight: 20, // Jarak antar baris supaya enak dibaca
    paddingHorizontal: 10,
  },
  // Container Tombol
  buttonContainer: {
    paddingHorizontal: 75,
    paddingBottom: 25,
  },
  button: {
    backgroundColor: COLORS.primary,
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.buttonShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SplashScreen;
