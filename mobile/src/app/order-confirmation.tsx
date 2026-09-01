import React, { useContext, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AppContext } from './_layout';

export default function OrderConfirmationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { setBagCount } = useContext(AppContext);

  // Fallbacks
  const displayBrand = params.brand || 'H&M';
  const displayTitle = params.title || 'Floral Print Maxi Dress';
  const displayPrice = params.price || '2499';
  const displayImage = params.image || 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?auto=format&fit=crop&q=80&w=400';
  const displaySize = params.size || 'M';

  // When order is confirmed, clear the bag
  useEffect(() => {
    setBagCount(0);
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Status Card */}
        <View style={styles.card}>
          <View style={styles.successIconContainer}>
            <Text style={styles.successIcon}>✓</Text>
          </View>
          <Text style={styles.title}>Order Placed Successfully!</Text>
          <Text style={styles.subtitle}>
            Thank you for shopping with us! Your order <Text style={styles.boldText}>#MYN-290823-7744</Text> has been received and is being processed.
          </Text>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressCircle}>
              <View style={styles.progressInnerCircle}>
                <Text style={styles.checkIcon}>✓</Text>
              </View>
            </View>
          </View>

          <Text style={styles.statusText}>Order Confirmed</Text>
          <Text style={styles.deliveryText}>Estimated Delivery: Aug 30 - Sep 1</Text>
        </View>

        {/* Order Details Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>ORDER DETAILS</Text>
          <View style={styles.divider} />
          <Text style={styles.amountText}>
            Total Amount: <Text style={styles.boldAmount}>₹{displayPrice}</Text> <Text style={styles.paymentMethod}>(Paid via Credit Card)</Text>
          </Text>
          <View style={styles.divider} />
          
          <View style={styles.productRow}>
            <Image 
              source={{ uri: displayImage as string }} 
              style={styles.productImage} 
            />
            <View style={styles.productInfo}>
              <Text style={styles.brandText}>{displayBrand}</Text>
              <Text style={styles.productName}>{displayTitle}</Text>
              <Text style={styles.sizeText}>Size: {displaySize}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueBtn} onPress={() => router.push('/')}>
          <Text style={styles.continueText}>CONTINUE SHOPPING</Text>
        </TouchableOpacity>
      </View>
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
    borderWidth: 1,
    borderColor: '#eaeaed',
  },
  successIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e6f6f2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successIcon: {
    color: '#03a685',
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#282c3f',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#535766',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#282c3f',
  },
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  progressCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 6,
    borderColor: '#03a685',
    borderLeftColor: '#e6f6f2',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '45deg' }],
  },
  progressInnerCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#03a685',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '-45deg' }],
  },
  checkIcon: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#282c3f',
    marginBottom: 4,
  },
  deliveryText: {
    fontSize: 14,
    color: '#535766',
  },
  sectionTitle: {
    width: '100%',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#282c3f',
    marginBottom: 12,
    textAlign: 'left',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#eaeaed',
    marginVertical: 12,
  },
  amountText: {
    width: '100%',
    fontSize: 15,
    color: '#3e4152',
    textAlign: 'left',
  },
  boldAmount: {
    fontWeight: 'bold',
    color: '#282c3f',
  },
  paymentMethod: {
    color: '#535766',
  },
  productRow: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  productImage: {
    width: 70,
    height: 90,
    borderRadius: 6,
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  brandText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#282c3f',
    marginBottom: 4,
  },
  productName: {
    fontSize: 14,
    color: '#535766',
    marginBottom: 6,
  },
  sizeText: {
    fontSize: 13,
    color: '#535766',
  },
  footer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eaeaed',
  },
  continueBtn: {
    backgroundColor: '#E7396A',
    paddingVertical: 14,
    borderRadius: 4,
    alignItems: 'center',
  },
  continueText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 1,
  },
});
