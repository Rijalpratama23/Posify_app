import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DraftScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Draft Laporan (Offline)</Text>
      <Text>(Data dari SQLite akan muncul di sini)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18, marginBottom: 10 },
});
