import React, { useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { AppContext } from './_layout';

export default function BagScreen() {
  const { bagCount, setBagCount } = useContext(AppContext);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {bagCount === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🛍️</Text>
            <Text style={styles.emptyTitle}>Hey, it feels so light!</Text>
            <Text style={styles.emptySubtitle}>There is nothing in your bag. Let's add some items.</Text>
          </View>
        ) : (
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Price Details ({bagCount} Items)</Text>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Total MRP</Text>
              <Text style={styles.rowValue}>₹{bagCount * 2999}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Discount on MRP</Text>
              <Text style={[styles.rowValue, styles.green]}>-₹{bagCount * 500}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Convenience Fee</Text>
              <Text style={[styles.rowValue, styles.green]}>FREE</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>₹{bagCount * 2499}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {bagCount > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.checkoutBtn} onPress={() => {
            router.push({
              pathname: '/order-confirmation',
              params: {
                brand: 'Roadster',
                title: 'High-Rise Wide Leg Jeans',
                price: (bagCount * 2499).toString(),
                image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=400',
                size: '30'
              }
            });
            setBagCount(0);
          }}>
            <Text style={styles.checkoutText}>PLACE ORDER</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f6',
  },
  scrollContent: {
    padding: 16,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#282c3f',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#7e818c',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  summaryContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#535766',
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  rowLabel: {
    fontSize: 14,
    color: '#3e4152',
  },
  rowValue: {
    fontSize: 14,
    color: '#3e4152',
  },
  green: {
    color: '#03a685',
  },
  divider: {
    height: 1,
    backgroundColor: '#eaeaed',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#282c3f',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#282c3f',
  },
  footer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eaeaed',
  },
  checkoutBtn: {
    backgroundColor: '#E7396A',
    paddingVertical: 14,
    borderRadius: 4,
    alignItems: 'center',
  },
  checkoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 1,
  },
});
