import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function LuxeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>LUXE</Text>
      <Text style={styles.subtitle}>Curated Luxury Brands</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D4AF37', // Gold color for luxury
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#535766',
  },
});
