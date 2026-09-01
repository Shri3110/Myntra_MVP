import express from 'express';

const app = express();
app.use(express.json());

// Mock Data
const users: any = {
  'user123': {
    id: 'user123',
    name: 'Ananya',
    profile: {
      heightCm: 165,
      weightKg: 55,
      usualSize: 'M',
      bodyType: 'Hourglass'
    }
  }
};

const wishlists: any = {
  'user123': [
    { sku: 'SKU1001', addedAt: '2023-10-25T10:00:00Z' },
    { sku: 'SKU1002', addedAt: '2023-10-26T14:30:00Z' },
    { sku: 'SKU1003', addedAt: '2023-10-27T14:30:00Z' },
    { sku: 'SKU1004', addedAt: '2023-10-28T14:30:00Z' },
    { sku: 'SKU1005', addedAt: '2023-10-29T10:00:00Z' },
    { sku: 'SKU1006', addedAt: '2023-10-29T11:00:00Z' },
    { sku: 'SKU1007', addedAt: '2023-10-29T12:00:00Z' },
    { sku: 'SKU1008', addedAt: '2023-10-30T14:30:00Z' },
    { sku: 'SKU1009', addedAt: '2023-10-31T09:00:00Z' },
    { sku: 'SKU1010', addedAt: '2023-10-31T10:30:00Z' },
    { sku: 'SKU1011', addedAt: '2023-11-01T14:30:00Z' },
    { sku: 'SKU1012', addedAt: '2023-11-02T16:00:00Z' }
  ]
};

const catalog: any = {
  'SKU1001': {
    sku: 'SKU1001',
    name: 'Floral Print Maxi Dress',
    brand: 'H&M',
    price: 2499,
    originalPrice: 4165,
    discountPercent: '40% OFF',
    category: 'Dresses',
    imageUrl: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?auto=format&fit=crop&q=80&w=400',
    availableSizes: ['S', 'M', 'L'],
    matchScore: Math.floor(Math.random() * (99 - 70 + 1)) + 70,
    reviewText: "Verified true to size by 40+ buyers",
    subtitle: "Tap for Real-Body Photos & Insights >"
  },
  'SKU1002': {
    sku: 'SKU1002',
    name: 'High-Rise Wide Leg Jeans',
    brand: 'Roadster',
    price: 1599,
    originalPrice: 3198,
    discountPercent: '50% OFF',
    category: 'Jeans',
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=400',
    availableSizes: ['28', '30', '32'],
    matchScore: Math.floor(Math.random() * (99 - 70 + 1)) + 70,
    reviewText: "Verified true to size by 40+ buyers",
    subtitle: "Tap for Real-Body Photos & Insights >"
  },
  'SKU1003': {
    sku: 'SKU1003',
    name: 'Classic White Sneakers',
    brand: 'Puma',
    price: 2999,
    originalPrice: 4999,
    discountPercent: '40% OFF',
    category: 'Shoes',
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=400',
    availableSizes: ['UK7', 'UK8', 'UK9'],
    matchScore: Math.floor(Math.random() * (99 - 70 + 1)) + 70,
    reviewText: "Verified true to size by 40+ buyers",
    subtitle: "Tap for Real-Body Photos & Insights >"
  },
  'SKU1004': {
    sku: 'SKU1004',
    name: 'Olive Green Bomber Jacket',
    brand: 'WROGN',
    price: 3499,
    originalPrice: 6998,
    discountPercent: '50% OFF',
    category: 'Jackets',
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=400',
    availableSizes: ['M', 'L', 'XL'],
    matchScore: Math.floor(Math.random() * (99 - 70 + 1)) + 70,
    reviewText: "Verified true to size by 40+ buyers",
    subtitle: "Tap for Real-Body Photos & Insights >"
  },
  'SKU1005': {
    sku: 'SKU1005',
    name: 'Black Ribbed Knit Top',
    brand: 'H&M',
    price: 999,
    originalPrice: 1499,
    discountPercent: '33% OFF',
    category: 'Tops',
    imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=400',
    availableSizes: ['S', 'M', 'L'],
    matchScore: Math.floor(Math.random() * (99 - 70 + 1)) + 70,
    reviewText: "Verified true to size by 40+ buyers",
    subtitle: "Tap for Real-Body Photos & Insights >"
  },
  'SKU1006': {
    sku: 'SKU1006',
    name: 'Gold Plated Hoop Earrings',
    brand: 'Fida',
    price: 499,
    originalPrice: 999,
    discountPercent: '50% OFF',
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=400',
    availableSizes: ['ONESIZE'],
    matchScore: Math.floor(Math.random() * (99 - 70 + 1)) + 70,
    reviewText: "Verified true to size by 40+ buyers",
    subtitle: "Tap for Real-Body Photos & Insights >"
  },
  'SKU1007': {
    sku: 'SKU1007',
    name: 'Red A-Line Midi Dress',
    brand: 'Berrylush',
    price: 1899,
    originalPrice: 2499,
    discountPercent: '24% OFF',
    category: 'Dresses',
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=400',
    availableSizes: ['XS', 'S', 'M'],
    matchScore: Math.floor(Math.random() * (99 - 70 + 1)) + 70,
    reviewText: "Verified true to size by 40+ buyers",
    subtitle: "Tap for Real-Body Photos & Insights >"
  },
  'SKU1008': {
    sku: 'SKU1008',
    name: 'Black Stiletto Heels',
    brand: 'DressBerry',
    price: 2199,
    originalPrice: 3999,
    discountPercent: '45% OFF',
    category: 'Shoes',
    imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=400',
    availableSizes: ['UK5', 'UK6', 'UK7'],
    matchScore: Math.floor(Math.random() * (99 - 70 + 1)) + 70,
    reviewText: "Verified true to size by 40+ buyers",
    subtitle: "Tap for Real-Body Photos & Insights >"
  },
  'SKU1009': {
    sku: 'SKU1009',
    name: 'Classic Blue Denim Jacket',
    brand: 'Levi\'s',
    price: 4299,
    originalPrice: 5999,
    discountPercent: '28% OFF',
    category: 'Jackets',
    imageUrl: 'https://images.unsplash.com/photo-1601333144130-8cbb312386b6?auto=format&fit=crop&q=80&w=400',
    availableSizes: ['S', 'M', 'L'],
    matchScore: Math.floor(Math.random() * (99 - 70 + 1)) + 70,
    reviewText: "Verified true to size by 40+ buyers",
    subtitle: "Tap for Real-Body Photos & Insights >"
  },
  'SKU1010': {
    sku: 'SKU1010',
    name: 'White Oversized T-Shirt',
    brand: 'The Souled Store',
    price: 799,
    originalPrice: 999,
    discountPercent: '20% OFF',
    category: 'Tops',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=400',
    availableSizes: ['S', 'M', 'L', 'XL'],
    matchScore: Math.floor(Math.random() * (99 - 70 + 1)) + 70,
    reviewText: "Verified true to size by 40+ buyers",
    subtitle: "Tap for Real-Body Photos & Insights >"
  },
  'SKU1011': {
    sku: 'SKU1011',
    name: 'Brown Leather Belt',
    brand: 'Allen Solly',
    price: 1199,
    originalPrice: 1999,
    discountPercent: '40% OFF',
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=400',
    availableSizes: ['32', '34', '36'],
    matchScore: Math.floor(Math.random() * (99 - 70 + 1)) + 70,
    reviewText: "Verified true to size by 40+ buyers",
    subtitle: "Tap for Real-Body Photos & Insights >"
  },
  'SKU1012': {
    sku: 'SKU1012',
    name: 'Grey Skinny Fit Jeans',
    brand: 'Mango',
    price: 2999,
    originalPrice: 4599,
    discountPercent: '34% OFF',
    category: 'Jeans',
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=400',
    availableSizes: ['28', '30', '32', '34'],
    matchScore: Math.floor(Math.random() * (99 - 70 + 1)) + 70,
    reviewText: "Verified true to size by 40+ buyers",
    subtitle: "Tap for Real-Body Photos & Insights >"
  }
};

const inventory: any = {
  'SKU1001': { 'S': 10, 'M': 5, 'L': 0 }, // L is out of stock
  'SKU1002': { '28': 2, '30': 15, '32': 8 },
  'SKU1003': { 'UK7': 5, 'UK8': 10, 'UK9': 2 },
  'SKU1004': { 'M': 10, 'L': 5, 'XL': 0 },
  'SKU1005': { 'S': 5, 'M': 12, 'L': 20 },
  'SKU1006': { 'ONESIZE': 50 },
  'SKU1007': { 'XS': 2, 'S': 5, 'M': 1 },
  'SKU1008': { 'UK5': 0, 'UK6': 10, 'UK7': 5 },
  'SKU1009': { 'S': 8, 'M': 0, 'L': 4 },
  'SKU1010': { 'S': 15, 'M': 15, 'L': 15, 'XL': 15 },
  'SKU1011': { '32': 5, '34': 5, '36': 0 },
  'SKU1012': { '28': 12, '30': 4, '32': 0, '34': 6 }
};

const ugcMedia: any = {
  'SKU1001': [
    { id: '1', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=200', username: '@stylebyananya' },
    { id: '2', url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=200', username: '@fashionista99' }
  ],
  'SKU1002': [
    { id: '3', url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=200', username: '@rahulstyles' },
    { id: '4', url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=200', username: '@denimlover' }
  ]
};

// --- Mock Routes ---

app.get('/internal/wishlist/:userId', (req, res) => {
  const userId = req.params.userId;
  const items = wishlists[userId] || [];
  
  // Hydrate with catalog info
  const hydratedItems = items.map((item: any) => ({
    ...item,
    product: catalog[item.sku]
  }));
  
  res.json({ userId, items: hydratedItems, userProfile: users[userId]?.profile });
});

app.get('/internal/inventory/:sku', (req, res) => {
  const sku = req.params.sku;
  res.json({ sku, inventory: inventory[sku] || {} });
});

app.get('/internal/ugc/:sku', (req, res) => {
  const sku = req.params.sku;
  res.json({ sku, media: ugcMedia[sku] || [] });
});

app.post('/internal/cart', (req, res) => {
  const { userId, sku, size } = req.body;
  const stock = inventory[sku]?.[size] || 0;
  
  if (stock > 0) {
    // Decrease stock mock
    inventory[sku][size] -= 1;
    res.json({ success: true, message: 'Added to cart' });
  } else {
    res.status(400).json({ success: false, message: 'Out of stock' });
  }
});

app.get('/internal/catalog', (req, res) => {
  // Return the values of the catalog object as an array
  res.json(Object.values(catalog));
});

app.post('/internal/wishlist', (req, res) => {
  const { userId, sku } = req.body;
  if (!wishlists[userId]) {
    wishlists[userId] = [];
  }
  // Check if item already exists in wishlist
  if (wishlists[userId].find((item: any) => item.sku === sku)) {
    return res.status(400).json({ success: false, message: 'Item already in wishlist' });
  }
  
  wishlists[userId].unshift({ sku, addedAt: new Date().toISOString() });
  res.json({ success: true, message: 'Added to wishlist' });
});

const PORT = 4000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Mock Service] Myntra Core Services running on port ${PORT}`);
});
