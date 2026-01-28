import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreens';
import HomeScreen from './src/screens/HomeScreen';
import AddReportScreen from './src/screens/AddScreenReport';
import DraftScreen from './src/screens/DraftScreen';
import RegisterScreen from './src/screens/RegisterScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Beranda Posify' }} />
        <Stack.Screen name="AddReport" component={AddReportScreen} options={{ title: 'Tambah Produk' }} />
        <Stack.Screen name="Draft" component={DraftScreen} options={{ title: 'Riwayat Transaksi' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
