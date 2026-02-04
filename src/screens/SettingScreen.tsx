import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Switch, ScrollView, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

// --- IMPORT FIREBASE ---
import { auth } from '../config/firebase'; // <--- Import Auth
import { signOut } from 'firebase/auth'; // <--- Import Fungsi Logout

const COLORS = {
  primary: '#1A237E',
  background: '#FFFFFF',
  textMain: '#1A237E',
  textBlack: '#333333',
  textGrey: '#9E9E9E',
  cardBorder: '#E0E0E0',
  logoutRed: '#FF3D00',
  buttonBlue: '#1A237E',
  backButtonBg: '#F5F5F5',
};

const ProfileScreen = ({ navigation }: any) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // --- AMBIL DATA USER ---
  const user = auth.currentUser;

  // --- FUNGSI LOGOUT ---
  const handleLogout = () => {
    Alert.alert('Konfirmasi', 'Apakah Anda yakin ingin keluar?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Keluar',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut(auth); // Hapus sesi Firebase
            navigation.replace('Login'); // Pindah ke Login
          } catch (error) {
            Alert.alert('Gagal', 'Terjadi kesalahan saat logout');
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 1. HEADER DENGAN TOMBOL BACK */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* 2. JUDUL HALAMAN */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Edit Profile Kamu Disini</Text>
          <Text style={styles.subTitle}>Isi detail tentang anda disini agar lebih mudah untuk diproses.</Text>
        </View>

        {/* 3. PROFILE INFO (DINAMIS DARI FIREBASE) */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {/* Jika user punya foto di firebase, pakai itu. Jika tidak, pakai dummy */}
            <Image source={{ uri: user?.photoURL ? user.photoURL : 'https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg' }} style={styles.avatar} />
          </View>

          {/* TAMPILKAN NAMA ASLI */}
          <Text style={styles.name}>{user?.displayName ? user.displayName : 'Pengguna Baru'}</Text>

          {/* TAMPILKAN EMAIL ASLI */}
          <Text style={styles.email}>{user?.email ? user.email : 'Belum ada email'}</Text>

          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* 4. KARTU STATISTIK */}
        <View style={styles.statsCard}>
          <View style={styles.folderIconContainer}>
            <MaterialCommunityIcons name="folder" size={28} color="#000" />
          </View>
          <View style={styles.statsTextContainer}>
            <Text style={styles.statsTitle}>Konten Disimpan</Text>
            <Text style={styles.statsSubtitle}>jumlah konten yang telah di simpan</Text>
          </View>
        </View>

        {/* 5. BAGIAN PENGATURAN */}
        <Text style={styles.sectionHeader}>Pengaturan</Text>

        <View style={styles.settingsContainer}>
          <View style={styles.settingItem}>
            <Text style={styles.settingText}>Dark Mode</Text>
            <Switch value={isDarkMode} onValueChange={setIsDarkMode} trackColor={{ false: '#767577', true: COLORS.primary }} thumbColor={isDarkMode ? '#fff' : '#f4f3f4'} />
          </View>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>Tentang Aplikasi</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* 6. TOMBOL KELUAR (DENGAN LOGIC) */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout} // <--- Pakai fungsi handleLogout
        >
          <Text style={styles.logoutText}>Keluar</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10 },
  header: { marginBottom: 20, alignItems: 'flex-start' },
  backButton: { width: 45, height: 45, borderRadius: 25, backgroundColor: COLORS.backButtonBg, justifyContent: 'center', alignItems: 'center' },
  titleSection: { marginBottom: 25 },
  mainTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.textMain, marginBottom: 8 },
  subTitle: { fontSize: 14, color: COLORS.textGrey, lineHeight: 20, maxWidth: '90%' },
  profileSection: { alignItems: 'center', marginBottom: 30 },
  avatarContainer: { width: 100, height: 100, borderRadius: 50, marginBottom: 15, borderWidth: 3, borderColor: '#E8EAF6', overflow: 'hidden' },
  avatar: { width: '100%', height: '100%', resizeMode: 'cover' },
  name: { fontSize: 18, fontWeight: 'bold', color: COLORS.textBlack, marginBottom: 4 },
  email: { fontSize: 14, color: COLORS.textGrey, marginBottom: 20 },
  editButton: { backgroundColor: COLORS.buttonBlue, paddingVertical: 12, paddingHorizontal: 40, borderRadius: 12, shadowColor: COLORS.buttonBlue, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 5 },
  editButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 16,
    padding: 15,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  folderIconContainer: { width: 50, height: 40, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  statsTextContainer: { flex: 1 },
  statsTitle: { fontSize: 16, fontWeight: 'bold', color: '#000', marginBottom: 4 },
  statsSubtitle: { fontSize: 12, color: COLORS.textGrey },
  sectionHeader: { fontSize: 18, fontWeight: 'bold', color: COLORS.textMain, marginBottom: 15 },
  settingsContainer: { borderWidth: 1, borderColor: COLORS.buttonBlue, borderRadius: 16, overflow: 'hidden', marginBottom: 30 },
  settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 20, backgroundColor: '#FFF' },
  settingText: { fontSize: 15, fontWeight: '600', color: '#000' },
  divider: { height: 1, backgroundColor: COLORS.buttonBlue, marginHorizontal: 0 },
  logoutButton: { backgroundColor: COLORS.logoutRed, paddingVertical: 15, borderRadius: 12, alignItems: 'center', marginBottom: 20 },
  logoutText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});

export default ProfileScreen;
