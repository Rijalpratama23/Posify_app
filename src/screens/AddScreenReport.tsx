import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AddReportScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Form Lapor Masalah</Text>
      <Text>(Nanti di sini ada Kamera & Input Teks)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18, marginBottom: 10 },
});
