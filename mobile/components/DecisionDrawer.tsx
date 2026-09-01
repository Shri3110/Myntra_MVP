import { View, Text, StyleSheet, Image, ActivityIndicator, Platform, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import BottomSheet, { BottomSheetView, BottomSheetScrollView } from '@gorhom/bottom-sheet';

interface DecisionDrawerProps {
  sku: string | null;
  aiBannerData?: any;
  onClose: () => void;
  onSuccess?: (sku: string, size: string, totalItemsAdded: number) => void;
}

const BFF_URL = process.env.EXPO_PUBLIC_API_URL || (Platform.OS === 'android' ? 'http://10.0.2.2:3001' : 'http://localhost:3001');

export const DecisionDrawer: React.FC<DecisionDrawerProps> = ({ sku, aiBannerData, onClose, onSuccess }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['85%', '95%'], []);
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  useEffect(() => {
    if (sku) {
      bottomSheetRef.current?.expand();
      fetchDetails();
    } else {
      bottomSheetRef.current?.close();
      setData(null);
      setSelectedSize(null);
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
        body: JSON.stringify({ userId: 'user123', sku, size: selectedSize })
      });
      onSuccess?.(sku as string, selectedSize, 1);
      onClose();
    } catch (e) {
      console.error('Add to bag failed', e);
    }
  };

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

  let confidenceLevel = aiBannerData?.confidenceLevel || 'INSUFFICIENT_DATA';
  let caveatText = aiBannerData?.caveatText;
  let reasons = aiBannerData?.reasons || [];
  
  const isHighMatch = confidenceLevel === 'HIGH';
  const isModerateMatch = confidenceLevel === 'MEDIUM';
  const badgeColor = isHighMatch ? '#00A66C' : isModerateMatch ? '#EAA100' : '#8a8d9a';
  const displayConfidence = confidenceLevel === 'INSUFFICIENT_DATA' ? 'INSUFFICIENT DATA' : confidenceLevel;

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onClose={onClose}
      enablePanDownToClose
      backgroundStyle={styles.bottomSheetBackground}
      handleComponent={data && !loading ? CustomHandle : undefined}
      bottomInset={Platform.OS === 'ios' ? 80 : 60}
    >
      {loading ? (
        <BottomSheetView style={styles.center}>
          <ActivityIndicator size="large" color="#E7396A" />
        </BottomSheetView>
      ) : !data ? (
        <BottomSheetView style={styles.center}>
          <Text style={{ color: '#7e818c' }}>Failed to load item details.</Text>
        </BottomSheetView>
      ) : (
        <BottomSheetView style={styles.contentContainer}>
          <BottomSheetScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            
            <View style={styles.confidenceSection}>
              <View style={[styles.badge, { backgroundColor: badgeColor }]}>
                <Text style={styles.badgeText}>FIT CONFIDENCE: {displayConfidence}</Text>
              </View>
              
              {confidenceLevel !== 'INSUFFICIENT_DATA' ? (
                <>
                  <Text style={styles.whyTitle}>Why we think so:</Text>
                  <View style={styles.reasonsList}>
                    {reasons.map((reason: string, idx: number) => (
                      <View key={idx} style={styles.reasonItem}>
                        <Text style={styles.checkIcon}>✓</Text>
                        <Text style={styles.reasonText}>{reason}</Text>
                      </View>
                    ))}
                  </View>
                </>
              ) : (
                <Text style={styles.insufficientText}>We don't have enough relevant fit information to confidently assess this product.</Text>
              )}
            </View>

            {caveatText && (
              <View style={styles.caveatBox}>
                <Text style={styles.caveatTitle}>⚠ SIZING CAVEAT</Text>
                <Text style={styles.caveatText}>{caveatText}</Text>
              </View>
            )}

            {/* REAL-USER FIT EVIDENCE (Fix #1) */}
            {data.ugc && data.ugc.length > 0 && (
              <>
                <View style={styles.divider} />
                <Text style={styles.sectionTitle}>REAL-USER FIT EVIDENCE</Text>
                <FlatList
                  horizontal
                  data={data.ugc}
                  keyExtractor={(item) => item.id}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.galleryList}
                  renderItem={({ item }) => (
                    <View style={styles.ugcWrapper}>
                      <Text style={styles.ugcHandle}>{item.authorHandle || item.username}</Text>
                      {(item.purchasedSize || item.sizeBought) && <Text style={styles.ugcSize}>Bought: {item.purchasedSize || item.sizeBought}</Text>}
                      {(item.caption || item.reviewText) && <Text style={styles.ugcReview} numberOfLines={3}>"{(item.caption || item.reviewText)}"</Text>}
                      {/* Using item.imageUrl fallback to item.url */}
                      <Image source={{ uri: item.imageUrl || item.url }} style={styles.ugcImage} />
                    </View>
                  )}
                />
              </>
            )}

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>SIZING & FABRIC INSIGHTS</Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>• Fabric: 100% Cotton</Text>
              <Text style={styles.bulletItem}>• Stretch: Medium</Text>
              <Text style={styles.bulletItem}>• Fit: True to size for hourglass shapes</Text>
            </View>

          </BottomSheetScrollView>

          {/* Sticky Footer Layout (Fix #3) */}
          <View style={styles.stickyFooter}>
            <Text style={styles.sizeTitle}>SELECT SIZE</Text>
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
            
            <View style={styles.recommendedSizeContainer}>
              <Text style={styles.recommendedText}>RECOMMENDED: M</Text>
              <Text style={styles.recommendedSubtext}>Based on your past purchase history and reviewer feedback.</Text>
            </View>

            <TouchableOpacity 
              style={[styles.primaryBtn, !selectedSize && styles.primaryBtnDisabled]} 
              onPress={handleMoveToBag}
              activeOpacity={0.8}
              disabled={!selectedSize}
            >
              <Text style={[styles.primaryBtnText, !selectedSize && styles.primaryBtnTextDisabled]}>
                MOVE TO BAG
              </Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      )}
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: '#fff',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40, // Reduced bottom padding since footer is now outside ScrollView
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confidenceSection: {
    marginBottom: 16,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginBottom: 12,
  },
  badgeText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  whyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#282c3f',
    marginBottom: 8,
  },
  reasonsList: {
    gap: 6,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  checkIcon: {
    color: '#00A66C',
    fontSize: 14,
    fontWeight: 'bold',
  },
  reasonText: {
    fontSize: 14,
    color: '#3e4152',
    flex: 1,
  },
  insufficientText: {
    fontSize: 14,
    color: '#7e818c',
    fontStyle: 'italic',
    marginTop: 4,
  },
  caveatBox: {
    backgroundColor: '#fff4f4',
    borderWidth: 1,
    borderColor: '#ffebec',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  caveatTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#e7396a',
    marginBottom: 4,
  },
  caveatText: {
    fontSize: 13,
    color: '#3e4152',
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#282c3f',
    marginBottom: 12,
  },
  galleryList: {
    gap: 16,
    minHeight: 220,
  },
  ugcWrapper: {
    width: 140,
  },
  ugcHandle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#282c3f',
    marginBottom: 2,
  },
  ugcSize: {
    fontSize: 11,
    color: '#7e818c',
    marginBottom: 6,
  },
  ugcReview: {
    fontSize: 12,
    color: '#3e4152',
    fontStyle: 'italic',
    marginBottom: 8,
    lineHeight: 16,
  },
  ugcImage: {
    width: 140,
    height: 180,
    borderRadius: 8,
    backgroundColor: '#f5f5f6',
  },
  divider: {
    height: 1,
    backgroundColor: '#eaeaed',
    marginVertical: 20,
  },
  bulletList: {
    marginTop: 4,
    gap: 8,
  },
  bulletItem: {
    fontSize: 14,
    color: '#3e4152',
    lineHeight: 20,
  },
  stickyFooter: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eaeaed',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
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
    marginBottom: 12,
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
  recommendedSizeContainer: {
    marginBottom: 16,
  },
  recommendedText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#00A66C',
    marginBottom: 2,
  },
  recommendedSubtext: {
    fontSize: 11,
    color: '#7e818c',
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
