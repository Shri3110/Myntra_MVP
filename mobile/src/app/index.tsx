import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { AppContext } from './_layout';

const BFF_URL = process.env.EXPO_PUBLIC_API_URL || (Platform.OS === 'android' ? 'http://10.0.2.2:3001' : 'http://localhost:3001');

const CATEGORIES = [
  { id: 'Dresses', title: 'Dresses', img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=200' },
  { id: 'Tops', title: 'Tops', img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=200' },
  { id: 'Jeans', title: 'Jeans', img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=200' },
  { id: 'Shoes', title: 'Shoes', img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=200' },
  { id: 'Accessories', title: 'Accessories', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=200' },
  { id: 'Jackets', title: 'Jackets', img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=200' },
];

export default function HomeScreen() {
  const [catalog, setCatalog] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      


      {/* Categories Avatar Bar */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
        style={Platform.OS === 'web' ? ({ overflowX: 'scroll' } as any) : {}}
      >
        {CATEGORIES.map(cat => {
          const isSelected = selectedCategory === cat.id;
          return (
            <TouchableOpacity 
              key={cat.id} 
              style={styles.categoryAvatar}
              onPress={() => setSelectedCategory(isSelected ? null : cat.id)}
            >
              <View style={[styles.squircle, isSelected && styles.squircleActive]}>
                <Image source={{ uri: cat.img }} style={styles.squircleImg} />
              </View>
              <Text style={[styles.categoryAvatarText, isSelected && styles.categoryAvatarTextActive]}>
                {cat.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>


      {/* Featured Feed */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trending Fits</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          scrollEnabled={true}
          contentContainerStyle={styles.featuredGrid}
          style={Platform.OS === 'web' ? ({ overflowX: 'scroll' } as any) : {}}
        >
          {loading ? (
            <ActivityIndicator size="large" color="#E7396A" />
          ) : (
            catalog
              .filter(item => !selectedCategory || item.category === selectedCategory)
              .map(item => (
              <View key={item.sku} style={styles.featuredCard}>
                <View style={styles.imageContainer}>
                  <Image source={{ uri: item.imageUrl }} style={styles.featuredImage} />
                  <TouchableOpacity 
                    style={styles.heartButton} 
                    onPress={() => toggleWishlist(item)}
                  >
                    <Text style={[styles.heartIcon, wishlistItems.some((i: any) => i.sku === item.sku) && { color: '#E7396A' }]}>
                      {wishlistItems.some((i: any) => i.sku === item.sku) ? '♥' : '♡'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.featuredInfo}>
                  <Text style={styles.featuredBrand}>{item.brand}</Text>
                  <Text style={styles.featuredName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.featuredPrice}>₹{item.price}</Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
      <View style={{height: 40}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  categoriesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 16,
  },
  categoryAvatar: {
    alignItems: 'center',
    width: 65,
  },
  squircle: {
    width: 60,
    height: 60,
    borderRadius: 22, // Approx squircle
    overflow: 'hidden',
    backgroundColor: '#f5f5f6',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#eaeaed',
  },
  squircleActive: {
    borderColor: '#E7396A',
  },
  squircleImg: {
    width: '100%',
    height: '100%',
  },
  categoryAvatarText: {
    fontSize: 11,
    color: '#282c3f',
    fontWeight: '600',
    textAlign: 'center',
  },
  categoryAvatarTextActive: {
    color: '#E7396A',
    fontWeight: '800',
  },
  couponBanner: {
    marginHorizontal: 16,
    backgroundColor: '#fef1f4',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#fce4ec',
  },
  couponLeft: {
    flex: 1,
  },
  couponTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#E7396A',
  },
  couponSubtitle: {
    fontSize: 11,
    color: '#535766',
    marginTop: 2,
  },
  couponRight: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#eaeaed',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  couponCodeLabel: {
    fontSize: 9,
    color: '#7e818c',
    marginBottom: 2,
  },
  couponCodeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#282c3f',
  },
  heroContainer: {
    marginHorizontal: 16,
    height: 280,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingTop: 60,
    // Emulating gradient with linear gradient or just rgba block
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  heroBrandTags: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  heroBrandPill: {
    backgroundColor: '#E7396A',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 2,
  },
  heroBrandText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
  },
  heroTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 4,
  },
  heroPrice: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  heroHashtag: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.8,
  },
  carouselDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
    marginBottom: 16,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#eaeaed',
  },
  dotActive: {
    backgroundColor: '#282c3f',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#282c3f',
    marginBottom: 12,
  },
  featuredGrid: {
    flexDirection: 'row',
  },
  featuredCard: {
    width: 140,
    backgroundColor: '#fff',
    borderRadius: 6,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#eaeaed',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 3/4,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  heartButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.1)',
  },
  heartIcon: {
    fontSize: 14,
    color: '#535766',
  },
  featuredInfo: {
    padding: 8,
  },
  featuredBrand: {
    fontWeight: '700',
    fontSize: 11,
    color: '#282c3f',
  },
  featuredName: {
    fontSize: 10,
    color: '#7e818c',
    marginTop: 2,
  },
  featuredPrice: {
    fontWeight: '700',
    fontSize: 12,
    color: '#282c3f',
    marginTop: 4,
  },
});
