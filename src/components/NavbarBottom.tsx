import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

function NavbarBottom({ state, descriptors, navigation }) {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        // --- PERBAIKAN DI SINI ---
        // Sesuaikan nama route dengan yang ada di App.js
        let iconName;
        if (route.name === 'Home') {
          iconName = isFocused ? 'home' : 'home-outline';
        } else if (route.name === 'Box') {
          // Dulu 'Inventory', sekarang 'Box'
          iconName = isFocused ? 'cube' : 'cube-outline';
        } else if (route.name === 'Draft') {
          // Dulu 'Orders', sekarang 'Draft'
          iconName = 'receipt'; // Receipt biasanya gak ada outline di versi lama, pakai default
        } else if (route.name === 'Settings') {
          // Dulu 'Profile', sekarang 'Settings'
          iconName = isFocused ? 'account' : 'account-outline';
        }

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity key={index} accessibilityRole="button" accessibilityState={isFocused ? { selected: true } : {}} onPress={onPress} style={styles.tabButton}>
            {/* Ikon */}
            <MaterialCommunityIcons
              name={iconName}
              size={30}
              // Jika Aktif: Biru Tua (#1A237E), Jika Tidak: Putih/Pudar (#FFF atau #7986CB)
              color={isFocused ? '#1A237E' : '#FFFFFF'}
            />

            {/* Indikator Garis Bawah (Agar mirip desain awalmu) */}
            {isFocused && (
              <View
                style={{
                  height: 3,
                  width: 20,
                  backgroundColor: '#1A237E',
                  marginTop: 4,
                  borderRadius: 2,
                }}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#C5CAE9', // Ungu Muda (Background Navbar)
    height: 70, // Sedikit dipendekkan agar pas
    width: width,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingBottom: 5, // Disesuaikan agar icon di tengah
    position: 'absolute',
    bottom: 0,
    elevation: 10, // Tambah shadow sedikit biar manis
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: 60, // Area sentuh diperjelas
  },
});

export default NavbarBottom;
