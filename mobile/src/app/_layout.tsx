import { Tabs, useRouter, usePathname } from 'expo-router';
import { StyleSheet, View, Platform, Text, TouchableOpacity, TextInput, Image, Animated } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createContext, useState, useEffect, useRef } from 'react';

export const AppContext = createContext<any>(null);

export default function RootLayout() {
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [bagCount, setBagCount] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  const wishlistCount = wishlistItems.length;
  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (wishlistCount > 0) {
      Animated.sequence([
        Animated.timing(scaleValue, { toValue: 1.3, duration: 150, useNativeDriver: true }),
        Animated.spring(scaleValue, { toValue: 1, friction: 3, useNativeDriver: true }),
      ]).start();
    }
  }, [wishlistCount]);

  const handleAddToWishlist = (product: any) => {
    setWishlistItems((prev: any[]) => {
      if (prev.find(item => item.sku === product.sku)) return prev;
      return [...prev, product];
    });
    showToast('Added to Wishlist');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <GestureHandlerRootView style={styles.webWrapper}>
      <AppContext.Provider value={{ wishlistItems, setWishlistItems, bagCount, setBagCount, showToast, wishlistCount, handleAddToWishlist }}>
        <View style={styles.mobileFrame}>
          
          {/* Custom Rich Top Header */}
          <View style={styles.headerContainer}>
            {/* Location Bar */}
            <View style={styles.locationBar}>
              <Text style={styles.locationText}>
                <Text style={{fontWeight: 'bold'}}>📍 Deliver to Thirumal Nagar - Tirunelveli, 627007,...</Text> ⌄
              </Text>
              <View style={styles.walletPill}>
                <Text style={styles.walletText}>₹0</Text>
                <Text style={styles.walletIcon}>💸</Text>
              </View>
            </View>

            {/* Search and Utilities Row */}
            <View style={styles.searchRow}>
              {/* Search Bar */}
              <View style={styles.searchBar}>
                <Text style={styles.myntraLogo}>M</Text>
                <TextInput 
                  style={styles.searchInput}
                  placeholder='"Pants"'
                  placeholderTextColor="#7e818c"
                  editable={false}
                />
                <View style={styles.searchIcons}>
                  <Text style={styles.iconSm}>🎤</Text>
                  <Text style={styles.iconSm}>📷</Text>
                </View>
              </View>
              
              {/* Utilities */}
              <View style={styles.utilities}>
                <TouchableOpacity activeOpacity={0.7} style={styles.utilBtn}>
                  <Text style={styles.utilIcon}>🔔</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  activeOpacity={0.7} 
                  style={styles.utilBtn}
                  onPress={() => router.push('/wishlist')}
                >
                  <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
                    <Text style={styles.utilIcon}>❤️</Text>
                    {wishlistCount > 0 && (
                      <View style={styles.wishlistBadge}>
                        <Text style={styles.bagBadgeText}>{wishlistCount}</Text>
                      </View>
                    )}
                  </Animated.View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7} style={styles.utilBtn}>
                  <Text style={styles.utilIcon}>👤</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
          {/* Content */}
          <View style={styles.content}>
            <Tabs 
              screenOptions={{ 
                headerShown: false, 
                tabBarActiveTintColor: '#ff3f6c',
                tabBarInactiveTintColor: '#282c3f',
                tabBarLabelPosition: 'below-icon',
                tabBarStyle: {
                  height: 64,
                  minHeight: 64,
                  backgroundColor: '#FFFFFF',
                  borderTopWidth: 1,
                  borderTopColor: '#f5f5f6',
                },
                tabBarItemStyle: {
                  overflow: 'visible',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: 0,
                },
                tabBarLabelStyle: {
                  fontSize: 11,
                  lineHeight: 13,
                  fontWeight: '600',
                  paddingBottom: 4,
                }
              }}
            >
              <Tabs.Screen 
                name="index" 
                options={{ 
                  title: 'Home',
                  tabBarIcon: ({ color, focused }) => (
                    <View style={styles.tabIconWrapper}>
                      {focused && <View style={styles.activeTabTopAccent} />}
                      <View style={styles.iconLogoWrapper}>
                        <Text style={{ color: focused ? '#ff3f6c' : '#282c3f', fontSize: 20, fontWeight: 'bold' }}>M</Text>
                      </View>
                    </View>
                  ),
                }} 
              />
              <Tabs.Screen 
                name="fwd" 
                options={{ 
                  title: 'Under ₹999',
                  tabBarIcon: ({ color, focused }) => (
                    <View style={styles.tabIconWrapper}>
                      {focused && <View style={styles.activeTabTopAccent} />}
                      <View style={styles.iconLogoWrapper}>
                        <Text style={{ color, fontSize: 16, fontWeight: '900', fontStyle: 'italic' }}>fwd</Text>
                      </View>
                    </View>
                  ),
                }} 
              />
              <Tabs.Screen 
                name="luxe" 
                options={{ 
                  title: 'Luxury',
                  tabBarIcon: ({ color, focused }) => (
                    <View style={styles.tabIconWrapper}>
                      {focused && <View style={styles.activeTabTopAccent} />}
                      <View style={styles.iconLogoWrapper}>
                        <Text style={{ color, fontSize: 14, fontWeight: '300', letterSpacing: 1 }}>LUXE</Text>
                      </View>
                    </View>
                  ),
                }} 
              />
              <Tabs.Screen 
                name="bag" 
                options={{ 
                  title: 'Bag',
                  tabBarIcon: ({ color, focused }) => (
                    <View style={styles.tabIconWrapper}>
                      {focused && <View style={styles.activeTabTopAccent} />}
                      <View style={styles.iconLogoWrapper}>
                        <Text style={{ color, fontSize: 18 }}>🛍️</Text>
                        {bagCount > 0 && (
                          <View style={styles.bagBadge}>
                            <Text style={styles.bagBadgeText}>{bagCount}</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  ),
                }} 
              />
              <Tabs.Screen 
                name="wishlist" 
                options={{ href: null }} 
              />
              <Tabs.Screen 
                name="order-confirmation" 
                options={{ href: null }} 
              />
            </Tabs>
          </View>

          {/* Toast Notification */}
          {toastMessage && (
            <View style={styles.toast}>
              <Text style={styles.toastText}>{toastMessage}</Text>
            </View>
          )}
        </View>
      </AppContext.Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  webWrapper: {
    flex: 1,
    backgroundColor: Platform.OS === 'web' ? '#f0f0f0' : '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileFrame: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 430 : '100%',
    height: '100%',
    backgroundColor: '#fff',
    overflow: 'hidden',
    ...(Platform.OS === 'web' && {
      boxShadow: '0 0 20px rgba(0,0,0,0.1)',
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderColor: '#eaeaed',
    }),
  },
  headerContainer: {
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 44 : 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f6',
  },
  locationBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  locationText: {
    fontSize: 12,
    color: '#282c3f',
  },
  walletPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  walletText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  walletIcon: {
    fontSize: 12,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eaeaed',
    borderRadius: 24,
    paddingHorizontal: 12,
    height: 44,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
  },
  myntraLogo: {
    fontSize: 20,
    fontWeight: '900',
    color: '#E7396A',
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#282c3f',
    outlineStyle: 'none',
  },
  searchIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconSm: {
    fontSize: 16,
    color: '#7e818c',
  },
  utilities: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  utilBtn: {
    padding: 2,
  },
  utilIcon: {
    fontSize: 20,
    color: '#282c3f',
  },
  content: {
    flex: 1,
  },
  tabIconWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  iconLogoWrapper: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabTopAccent: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 3,
    backgroundColor: '#ff3f6c',
  },
  bagBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#ff3f6c',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bagBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  wishlistBadge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: '#ff3f6c',
    width: 14,
    height: 14,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toast: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    backgroundColor: '#282c3f',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
  },
  toastText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
