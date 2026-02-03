import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// --- IMPORT SCREEN ---
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreens';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import AddReportScreen from './src/screens/ListScreen'; // Halaman "Orders"
import DraftScreen from './src/screens/BoxScreen'; // Halaman "Inventory"
import ProfileScreen from './src/screens/SettingScreen'; // Halaman "Profile"

// Import Custom Navbar
import NavbarBottom from './src/components/NavbarBottom';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// --- 1. Konfigurasi Tab (MainApp) ---
function MainAppTabs() {
  return (
    <Tab.Navigator
      // Hubungkan dengan Custom Navbar
      tabBar={(props) => <NavbarBottom {...props} />}
      screenOptions={{ headerShown: false }}
    >
      {/* 1. Home */}
      <Tab.Screen name="Home" component={HomeScreen} />

      {/* 2. Inventory (Kubus) */}
      <Tab.Screen name="Inventory" component={DraftScreen} />

      {/* 3. Orders (Bon/Kertas) */}
      <Tab.Screen name="Orders" component={AddReportScreen} />

      {/* 4. Profile (User) */}
      {/* PENTING: Gunakan name="Profile" agar cocok dengan logika di NavbarBottom.js */}
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// --- 2. App Utama ---
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        {/* Grup Layar Awal (Tanpa Navbar) */}
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />

        {/* Grup Aplikasi Utama (Pakai Navbar) */}
        {/* User masuk ke sini setelah Login */}
        <Stack.Screen name="MainApp" component={MainAppTabs} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
