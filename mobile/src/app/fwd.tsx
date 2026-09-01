import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { AppContext } from './_layout';

const BFF_URL = process.env.EXPO_PUBLIC_API_URL || (Platform.OS === 'android' ? 'http://10.0.2.2:3001' : 'http://localhost:3001');

export default function ExploreScreen() {
  const [catalog, setCatalog] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { wishlistItems, setWishlistItems, showToast } = useContext(AppContext);

  useEffect(() => {
    fetch(`${BFF_URL}/api/catalog`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCatalog(data);
        } else {
          setCatalog([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch catalog', err);
        setLoading(false);
      });
  }, []);

  const toggleWishlist = (item: any) => {
    const isWishlisted = wishlistItems.some((i: any) => i.sku === item.sku);
    if (isWishlisted) {
      setWishlistItems((prev: any[]) => prev.filter((i: any) => i.sku !== item.sku));
      showToast('Removed from Wishlist');
    } else {
      setWishlistItems((prev: any[]) => [{ product: item, sku: item.sku }, ...prev]);
      showToast('Added to Wishlist!');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore New Trends</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <ActivityIndicator size="large" color="#E7396A" style={{ marginTop: 50 }} />
        ) : (
          <View style={styles.grid}>
            {catalog.map(item => (
              <View key={item.sku} style={styles.card}>
                <View style={styles.imageContainer}>
                  <Image source={{ uri: item.imageUrl }} style={styles.image} />
                  <TouchableOpacity 
                    style={styles.heartButton} 
                    onPress={() => toggleWishlist(item)}
                  >
                    <Text style={[styles.heartIcon, wishlistItems.some((i: any) => i.sku === item.sku) && { color: '#E7396A' }]}>
                      {wishlistItems.some((i: any) => i.sku === item.sku) ? '♥' : '♡'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.info}>
                  <Text style={styles.brand}>{item.brand}</Text>
                  <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.price}>₹{item.price}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    paddingTop: 24,
    backgroundColor: '#f5f5f6',
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaed',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#282c3f',
  },
  scrollContent: {
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#f5f5f6',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 3/4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  heartButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.1)',
  },
  heartIcon: {
    fontSize: 16,
    color: '#535766',
    marginTop: -2,
  },
  info: {
    padding: 8,
  },
  brand: {
    fontWeight: '700',
    fontSize: 12,
    color: '#282c3f',
  },
  name: {
    fontSize: 11,
    color: '#7e818c',
    marginTop: 2,
  },
  price: {
    fontWeight: '700',
    fontSize: 13,
    color: '#282c3f',
    marginTop: 4,
  },
});
