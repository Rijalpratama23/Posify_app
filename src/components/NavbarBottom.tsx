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

        // Tentukan Icon berdasarkan nama Route
        let iconName;
        if (route.name === 'Home') iconName = 'home';
        else if (route.name === 'Inventory') iconName = 'cube';
        else if (route.name === 'Orders') iconName = 'receipt';
        else if (route.name === 'Profile') iconName = 'account';

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
            <MaterialCommunityIcons
              name={iconName}
              size={30}
              // Logika Warna: Jika Fokus Biru Tua, Jika tidak Putih
              color={isFocused ? '#1A237E' : '#FFFFFF'}
            />
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
    backgroundColor: '#C5CAE9', // Ungu Muda
    height: 80,
    width: width,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingBottom: 10,
    position: 'absolute',
    bottom: 0,
    elevation: 0,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
});

export default NavbarBottom;
