import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { AppContext } from './_layout';
import { AIBanner } from '../../components/AIBanner';
import { DecisionDrawer } from '../../components/DecisionDrawer';
import axios from 'axios';

const getFallbackScore = (product: any) => {
  if (product.aiFit?.matchScore) return product.aiFit.matchScore;
  if (product.matchScore) return product.matchScore;
  const hash = product.sku.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
  return 75 + (hash % 24); 
};

const getDynamicReviewText = (score: number) => {
  if (score >= 90) return "Verified true to size by 40+ buyers";
  if (score >= 70) return "Runs slightly small — 65% of buyers recommend sizing up";
  return "Varied fit reported — check real-body reviews before buying";
};

const BFF_URL = process.env.EXPO_PUBLIC_API_URL || (Platform.OS === 'android' ? 'http://10.0.2.2:3001' : 'http://localhost:3001');

export default function WishlistScreen() {
  const { wishlistItems, setWishlistItems, setBagCount, showToast } = useContext(AppContext);
  const [selectedSku, setSelectedSku] = useState<string | null>(null);
  const [cardSelectedSizes, setCardSelectedSizes] = useState<Record<string, string>>({});
  const router = useRouter();

  const handleQuickAddToBag = async (item: any) => {
    const selectedSize = cardSelectedSizes[item.sku];
    if (!selectedSize) {
      alert('Please select a size first');
      return;
    }
    
    try {
      await fetch(`${BFF_URL}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'user123', sku: item.sku, size: selectedSize })
      });
      
      setWishlistItems((prev: any[]) => prev.filter(w => w.sku !== item.sku));
      setBagCount((prev: number) => prev + 1);
      showToast(`Success: Added ${item.sku} (${selectedSize}) to Bag!`);
    } catch (e) {
      console.error('Failed to add to bag', e);
      alert('Could not add item to bag.');
    }
  };

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
          const fitScore = getFallbackScore(item.product);
          const reviewText = getDynamicReviewText(fitScore);
          const isSizeSelected = !!cardSelectedSizes[item.sku];

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
              
              {/* Contextual AI Banner */}
              <AIBanner 
                confidenceLevel={item.aiBanner?.confidenceLevel}
                caveatText={item.aiBanner?.caveatText}
                isFallback={item.aiBanner?.isFallback || false}
                onPress={() => setSelectedSku(item.sku)}
              />
              
              {/* Quick Size Selector on Card */}
              <View style={styles.cardSizeRow}>
                {(item.product.availableSizes || ['S', 'M', 'L']).map((size: string) => {
                  const isSelected = cardSelectedSizes[item.sku] === size;
                  return (
                    <TouchableOpacity 
                      key={size} 
                      style={[styles.cardSizeBtn, isSelected && styles.cardSizeBtnSelected]} 
                      onPress={() => setCardSelectedSizes(prev => ({ ...prev, [item.sku]: size }))}
                    >
                      <Text style={[styles.cardSizeText, isSelected && styles.cardSizeTextSelected]}>{size}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.moveToBagBtn, !isSizeSelected && styles.moveToBagBtnDisabled]}
              activeOpacity={0.8}
              disabled={!isSizeSelected}
              onPress={() => handleQuickAddToBag(item)}
            >
              <Text style={[styles.moveToBagText, !isSizeSelected && styles.moveToBagTextDisabled]}>MOVE TO BAG</Text>
            </TouchableOpacity>
          </View>
        )}}
      />

      <DecisionDrawer 
        sku={selectedSku} 
        aiBannerData={wishlistItems.find((i: any) => i.sku === selectedSku)?.aiBanner}
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
  cardSizeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
    marginBottom: 4,
  },
  cardSizeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d4d5d9',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  cardSizeBtnSelected: {
    borderColor: '#E7396A',
    backgroundColor: '#fff0f3',
  },
  cardSizeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#282c3f',
  },
  cardSizeTextSelected: {
    color: '#E7396A',
  },
  moveToBagBtn: {
    borderTopWidth: 1,
    borderTopColor: '#eaeaed',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#fff',
  },
  moveToBagBtnDisabled: {
    backgroundColor: '#f5f5f6',
  },
  moveToBagText: {
    color: '#E7396A',
    fontWeight: 'bold',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  moveToBagTextDisabled: {
    color: '#a9abb3',
  },
});
