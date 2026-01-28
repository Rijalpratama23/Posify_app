import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Beranda - Feed Laporan</Text>
      <Button title="Buat Laporan Baru" onPress={() => navigation.navigate('AddReport')} />
      <View style={{ margin: 10 }} />
      <Button title="Lihat Draft (Offline)" onPress={() => navigation.navigate('Draft')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18, marginBottom: 20 }
});