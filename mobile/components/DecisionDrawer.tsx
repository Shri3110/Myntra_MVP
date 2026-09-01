import { View, Text, StyleSheet, Image, ActivityIndicator, Platform, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import BottomSheet, { BottomSheetView, BottomSheetScrollView, BottomSheetFooter } from '@gorhom/bottom-sheet';

interface DecisionDrawerProps {
  sku: string | null;
  onClose: () => void;
  onSuccess?: (sku: string, size: string, totalItemsAdded: number) => void;
}

const BFF_URL = process.env.EXPO_PUBLIC_API_URL || (Platform.OS === 'android' ? 'http://10.0.2.2:3001' : 'http://localhost:3001');

export const DecisionDrawer: React.FC<DecisionDrawerProps> = ({ sku, onClose, onSuccess }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['75%', '95%'], []);
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedStyles, setSelectedStyles] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (sku) {
      bottomSheetRef.current?.expand();
      fetchDetails();
    } else {
      bottomSheetRef.current?.close();
      setData(null);
      setSelectedSize(null);
      setSelectedStyles(new Set());
    }
  }, [sku]);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BFF_URL}/api/wishlist/details/user123/${sku}`);
      const json = await response.json();
      setData(json);
    } catch (e) {
      console.error('Failed to load details', e);
    } finally {
      setLoading(false);
    }
  };

  const handleMoveToBag = async () => {
    if (!selectedSize) {
      alert('Please select a size first');
      return;
    }
    try {
      await fetch(`${BFF_URL}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'user123', sku, size: selectedSize, additionalStyles: Array.from(selectedStyles) })
      });
      onSuccess?.(sku as string, selectedSize, 1 + selectedStyles.size);
      onClose();
    } catch (e) {
      console.error('Add to bag failed', e);
    }
  };


  const renderFooter = useCallback(
    (props: any) => (
      <BottomSheetFooter {...props} bottomInset={0}>
        <View style={styles.stickyFooter}>
          <Text style={styles.sizeTitle}>Select Size</Text>
          <View style={styles.sizeRow}>
            {['S', 'M', 'L', 'XL'].map(size => {
              const stock = data?.inventory?.[size] ?? 10;
              const isSelected = selectedSize === size;
              const isOOS = stock === 0;

              return (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.sizeBtn,
                    isSelected && styles.sizeBtnSelected,
                    isOOS && styles.sizeBtnDisabled
                  ]}
                  onPress={() => !isOOS && setSelectedSize(size)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.sizeText,
                    isSelected && styles.sizeTextSelected,
                    isOOS && styles.sizeTextDisabled
                  ]}>{size}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity 
            style={[styles.primaryBtn, !selectedSize && styles.primaryBtnDisabled]} 
            onPress={handleMoveToBag}
            activeOpacity={0.8}
          >
            <Text style={[styles.primaryBtnText, !selectedSize && styles.primaryBtnTextDisabled]}>
              {selectedStyles.size > 0 
                ? `MOVE OUTFIT TO BAG (${selectedStyles.size + 1} ITEMS)`
                : 'MOVE TO BAG'}
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheetFooter>
    ),
    [data, selectedSize, selectedStyles, handleMoveToBag]
  );

  const CustomHandle = useCallback(
    (props: any) => (
      <View style={styles.handleContainer}>
        <View style={styles.handleIndicator} />
        <View style={styles.drawerHeader}>
          <Text style={styles.drawerTitle}>AI Fit & Decision Assistant</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>
    ),
    [onClose]
  );

  if (!sku) return null;

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onClose={onClose}
      enablePanDownToClose
      backgroundStyle={styles.bottomSheetBackground}
      footerComponent={data && !loading ? renderFooter : undefined}
      handleComponent={data && !loading ? CustomHandle : undefined}
    >
      {loading ? (
        <BottomSheetView style={styles.contentContainer}>
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#E7396A" />
          </View>
        </BottomSheetView>
      ) : !data ? (
        <BottomSheetView style={styles.contentContainer}>
          <View style={styles.center}>
            <Text style={{ color: '#7e818c' }}>Failed to load item details.</Text>
          </View>
        </BottomSheetView>
      ) : (
        <BottomSheetScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
              
              <Text style={styles.sectionTitle}>Real-Body Try-On Gallery</Text>
              <Text style={styles.sectionSubtitle}>See how it looks on shoppers like you</Text>
              
              {data.ugc && data.ugc.length > 0 ? (
                <FlatList
                  horizontal
                  data={data.ugc}
                  keyExtractor={(item) => item.id}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.galleryList}
                  renderItem={({ item }) => (
                    <View style={styles.ugcWrapper}>
                      <Image source={{ uri: item.url }} style={styles.ugcImage} />
                      <Text style={styles.ugcHandle}>{item.username}</Text>
                    </View>
                  )}
                />
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.galleryList}>
                  {[
                    { id: 'mock1', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=200', username: '@style1' },
                    { id: 'mock2', url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=200', username: '@style2' },
                    { id: 'mock3', url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=200', username: '@style3' }
                  ].map(item => (
                    <View key={item.id} style={styles.ugcWrapper}>
                      <Image source={{ uri: item.url }} style={styles.ugcImage} />
                      <Text style={styles.ugcHandle}>{item.username}</Text>
                    </View>
                  ))}
                </ScrollView>
              )}

              <View style={styles.divider} />

              <Text style={styles.sectionTitle}>Sizing & Fabric Insights</Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletItem}>• 14 shoppers with similar build loved the fit.</Text>
                <Text style={styles.bulletItem}>• Fabric: 100% Cotton, stretchable waist.</Text>
                <Text style={styles.bulletItem}>• Note: Runs slightly long, great for heels.</Text>
              </View>

              {data.stylingRecommendations && data.stylingRecommendations.length > 0 && (
                <>
                  <View style={styles.divider} />
                  <Text style={styles.sectionTitle}>Outfit Styling Suggestions</Text>
                  
                  <FlatList
                    horizontal
                    data={data.stylingRecommendations}
                    keyExtractor={(item) => item.sku}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.galleryList}
                    renderItem={({ item }) => {
                      const isSelected = selectedStyles.has(item.sku);
                      return (
                        <TouchableOpacity 
                          style={[styles.styleCard, isSelected && styles.styleCardSelected]}
                          onPress={() => {
                            setSelectedStyles(prev => {
                              const newSet = new Set(prev);
                              if (newSet.has(item.sku)) newSet.delete(item.sku);
                              else newSet.add(item.sku);
                              return newSet;
                            });
                          }}
                          activeOpacity={0.8}
                        >
                          <Image source={{ uri: item.imageUrl }} style={[styles.styleImage, isSelected && styles.styleImageSelected]} />
                          {isSelected && (
                            <View style={styles.checkmarkBadge}>
                              <Text style={styles.checkmarkText}>✓</Text>
                            </View>
                          )}
                          <Text style={styles.styleName} numberOfLines={2}>{item.name}</Text>
                        </TouchableOpacity>
                      );
                    }}
                  />
                </>
              )}
            </BottomSheetScrollView>
      )}
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: '#fff',
    borderRadius: 24,
    boxShadow: '0px 10px 10px rgba(0, 0, 0, 0.1)',
  },
  contentContainer: {
    flex: 1,
  },
  handleContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f6',
  },
  handleIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#d4d5d9',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 6,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#282c3f',
  },
  closeBtn: {
    padding: 4,
  },
  closeIcon: {
    fontSize: 20,
    color: '#535766',
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 200, // Guarantee clearance for the sticky footer
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#282c3f',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#7e818c',
    marginBottom: 16,
  },
  galleryList: {
    gap: 12,
    minHeight: 180,
  },
  ugcWrapper: {
    width: 120,
  },
  ugcImage: {
    width: 120,
    height: 160,
    borderRadius: 8,
    backgroundColor: '#f5f5f6',
  },
  ugcHandle: {
    marginTop: 6,
    fontSize: 11,
    color: '#535766',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#eaeaed',
    marginVertical: 20,
  },
  bulletList: {
    marginTop: 10,
    gap: 8,
  },
  bulletItem: {
    fontSize: 14,
    color: '#3e4152',
    lineHeight: 20,
  },
  styleCard: {
    width: 100,
    position: 'relative',
  },
  styleCardSelected: {
    opacity: 0.9,
  },
  styleImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#f5f5f6',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  styleImageSelected: {
    borderColor: '#E7396A',
  },
  checkmarkBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#E7396A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.15)',
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  styleName: {
    marginTop: 6,
    fontSize: 11,
    color: '#282c3f',
  },
  emptyText: {
    color: '#7e818c',
    fontStyle: 'italic',
  },
  stickyFooter: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eaeaed',
    boxShadow: '0px -3px 5px rgba(0, 0, 0, 0.05)',
  },
  sizeTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#282c3f',
    marginBottom: 12,
  },
  sizeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  sizeBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#d4d5d9',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  sizeBtnSelected: {
    borderColor: '#E7396A',
    borderWidth: 2,
    backgroundColor: '#fff',
  },
  sizeBtnDisabled: {
    borderColor: '#f5f5f6',
    backgroundColor: '#f5f5f6',
  },
  sizeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#282c3f',
  },
  sizeTextSelected: {
    color: '#E7396A',
  },
  sizeTextDisabled: {
    color: '#d4d5d9',
  },
  primaryBtn: {
    backgroundColor: '#E7396A',
    paddingVertical: 16,
    borderRadius: 4,
    alignItems: 'center',
  },
  primaryBtnDisabled: {
    backgroundColor: '#F5F5F6',
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 1,
  },
  primaryBtnTextDisabled: {
    color: '#94969F',
  },
});
