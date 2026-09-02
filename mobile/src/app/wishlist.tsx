import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { AppContext } from './_layout';
import { AIBanner } from '../../components/AIBanner';
import { DecisionDrawer } from '../../components/DecisionDrawer';

export default function WishlistScreen() {
  const { wishlistItems, setWishlistItems, setBagCount, showToast } = useContext(AppContext);
  const [selectedSku, setSelectedSku] = useState<string | null>(null);
  const [banners, setBanners] = useState<Record<string, any>>({});
  const router = useRouter();
  
  const BFF_URL = process.env.EXPO_PUBLIC_API_URL || (Platform.OS === 'android' ? 'http://10.0.2.2:3001' : 'http://localhost:3001');

  useEffect(() => {
    const fetchBanners = async () => {
      const newBanners = { ...banners };
      let updated = false;

      for (const item of wishlistItems) {
        if (!newBanners[item.sku]) {
          try {
            const res = await fetch(`${BFF_URL}/api/wishlist/banner/user123`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ item: { sku: item.sku, product: item.product || item } })
            });
            if (res.ok) {
              const data = await res.json();
              newBanners[item.sku] = data;
              updated = true;
            }
          } catch (e) {
            console.error('Failed to fetch banner for', item.sku);
          }
        }
      }
      if (updated) {
        setBanners(newBanners);
      }
    };

    fetchBanners();
  }, [wishlistItems]);

  if (wishlistItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>❤️</Text>
        <Text style={styles.emptyTitle}>YOUR WISHLIST IS EMPTY</Text>
        <Text style={styles.emptySubtitle}>Save items you love by tapping the heart icon while browsing.</Text>
        <TouchableOpacity style={styles.exploreBtn} onPress={() => router.push('/')}>
          <Text style={styles.exploreText}>EXPLORE TRENDING STYLES</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={wishlistItems}
        keyExtractor={(item) => item.sku}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const aiBanner = item.aiBanner || banners[item.sku] || {
            confidenceLevel: 'LOW',
            caveatText: 'Calculating sizing insights...',
            reasons: ['Please wait while we gather fit data'],
            recommendedSize: 'M',
            recommendedSizeRationale: 'Fallback',
            isFallback: true
          };

          return (
          <View style={styles.card}>
            <View style={styles.imageContainer}>
              <Image 
                source={{ uri: item.product.imageUrl }} 
                style={styles.image} 
                resizeMode="cover"
              />
              <TouchableOpacity 
                style={styles.removeBtn}
                activeOpacity={0.7}
                onPress={() => {
                  setWishlistItems((prev: any[]) => prev.filter(w => w.sku !== item.sku));
                }}
              >
                <Text style={styles.removeIcon}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.brand} numberOfLines={1}>{item.product.brand}</Text>
              <Text style={styles.name} numberOfLines={1}>{item.product.name}</Text>
              
              <View style={styles.priceRow}>
                <Text style={styles.price}>₹{item.product.price}</Text>
                {item.product.originalPrice && (
                  <Text style={styles.originalPrice}>₹{item.product.originalPrice}</Text>
                )}
                {item.product.discountPercent && (
                  <Text style={styles.discount}>({item.product.discountPercent})</Text>
                )}
              </View>
              
              <AIBanner 
                confidenceLevel={aiBanner.confidenceLevel as any}
                caveatText={aiBanner.caveatText}
                isFallback={aiBanner.isFallback}
                onPress={() => setSelectedSku(item.sku)}
              />
            </View>

            <TouchableOpacity 
              style={styles.moveToBagBtn}
              activeOpacity={0.8}
              onPress={() => setSelectedSku(item.sku)}
            >
              <Text style={styles.moveToBagText}>MOVE TO BAG</Text>
            </TouchableOpacity>
          </View>
        )}}
      />

      <DecisionDrawer 
        sku={selectedSku} 
        aiBannerData={wishlistItems.find((i: any) => i.sku === selectedSku)?.aiBanner || banners[selectedSku || '']}
        onClose={() => setSelectedSku(null)} 
        onSuccess={(sku, size, addedCount = 1) => {
          setWishlistItems((prev: any[]) => prev.filter(item => item.sku !== sku));
          setBagCount((prev: number) => prev + addedCount);
          showToast(addedCount > 1 ? `Success: Added ${addedCount} items to Bag!` : `Success: Added ${sku} (${size}) to Bag!`);
          setSelectedSku(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f6',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#282c3f',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#7e818c',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  exploreBtn: {
    backgroundColor: '#E7396A',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 4,
  },
  exploreText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 1,
  },
  listContainer: {
    padding: 8,
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#fff',
    width: '49%',
    marginBottom: 12,
    borderRadius: 4,
    overflow: 'hidden',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 3 / 4,
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#eaeaed',
  },
  removeBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.1)',
  },
  removeIcon: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#535766',
  },
  cardBody: {
    padding: 10,
    flex: 1,
  },
  brand: {
    fontWeight: '700',
    fontSize: 14,
    color: '#282c3f',
    marginBottom: 2,
  },
  name: {
    fontSize: 12,
    color: '#7e818c',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  price: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#282c3f',
  },
  originalPrice: {
    fontSize: 12,
    color: '#a9abb3',
    textDecorationLine: 'line-through',
  },
  discount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ff905a',
  },
  moveToBagBtn: {
    borderTopWidth: 1,
    borderTopColor: '#eaeaed',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  moveToBagText: {
    color: '#E7396A',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 0.5,
  },
});
