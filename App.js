import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// --- SERVICE (JANGAN DIHAPUS) ---
import { initDB } from './src/services/localDB';

// --- IMPORT SCREENS ---
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreens'; // Sesuaikan jika nama filenya beda (misal LoginScreen)
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import BoxScreen from './src/screens/BoxScreen'; // Halaman Pending Order (Offline)
import ListScreen from './src/screens/ListScreen'; // Halaman Riwayat Transaksi (Online)
import SettingScreen from './src/screens/SettingScreen'; // Halaman Profile/Settings

// --- IMPORT COMPONENTS ---
import NavbarBottom from './src/components/NavbarBottom';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// --- 1. Konfigurasi Tab Bar (Menu Bawah) ---
function MainAppTabs() {
  // Inisialisasi Database SQLite saat Tab Bar dimuat
  useEffect(() => {
    const setupDatabase = async () => {
      await initDB();
    };
    setupDatabase();
  }, []);

  return (
    <Tab.Navigator
      // Hubungkan dengan Custom Navbar yang sudah kamu buat
      tabBar={(props) => <NavbarBottom {...props} />}
      screenOptions={{ headerShown: false }}
    >
      {/* 1. HOME */}
      <Tab.Screen name="Home" component={HomeScreen} />

      {/* 2. BOX (Pending Order / SQLite) */}
      {/* PENTING: Namanya harus "Box" agar tombol Kubus di Navbar & Home jalan */}
      <Tab.Screen name="Box" component={BoxScreen} />

      {/* 3. DRAFT (Riwayat Transaksi / Firebase) */}
      {/* PENTING: Namanya harus "Draft" agar tombol Struk di Navbar & Home jalan */}
      <Tab.Screen name="Draft" component={ListScreen} />

      {/* 4. SETTINGS (Profile) */}
      {/* PENTING: Namanya harus "Settings" agar tombol User di Navbar & Home jalan */}
      <Tab.Screen name="Settings" component={SettingScreen} />
    </Tab.Navigator>
  );
}

// --- 2. App Navigation Utama ---
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        {/* Grup Autentikasi & Splash */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />

        {/* Grup Aplikasi Utama (Berisi Tab Bar) */}
        {/* Setelah Login, user dilempar ke 'MainApp' ini */}
        <Stack.Screen name="MainApp" component={MainAppTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
