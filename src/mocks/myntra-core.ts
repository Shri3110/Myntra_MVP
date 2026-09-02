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
    { sku: 'SKU1004', addedAt: '2023-10-28T14:30:00Z' },
    { sku: 'SKU1005', addedAt: '2023-10-29T10:00:00Z' },
    { sku: 'SKU1007', addedAt: '2023-10-29T12:00:00Z' },
    { sku: 'SKU1009', addedAt: '2023-10-31T09:00:00Z' },
    { sku: 'SKU1010', addedAt: '2023-10-31T10:30:00Z' },
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
    availableSizes: ['S', 'M', 'L', 'XL'],
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
  'SKU1012': {
    sku: 'SKU1012',
    name: 'Grey Skinny Fit Jeans',
    brand: 'Mango',
    price: 2999,
    originalPrice: 4599,
    discountPercent: '34% OFF',
    category: 'Jeans',
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=400',
    availableSizes: ['S', 'M', 'L', 'XL'],
    matchScore: Math.floor(Math.random() * (99 - 70 + 1)) + 70,
    reviewText: "Verified true to size by 40+ buyers",
    subtitle: "Tap for Real-Body Photos & Insights >"
  }
};

const inventory: any = {
  'SKU1001': { 'S': 10, 'M': 5, 'L': 0 },
  'SKU1002': { 'S': 2, 'M': 15, 'L': 8, 'XL': 0 },
  'SKU1004': { 'M': 10, 'L': 5, 'XL': 0 },
  'SKU1005': { 'S': 5, 'M': 12, 'L': 20 },
  'SKU1007': { 'XS': 2, 'S': 5, 'M': 1 },
  'SKU1009': { 'S': 8, 'M': 0, 'L': 4 },
  'SKU1010': { 'S': 15, 'M': 15, 'L': 15, 'XL': 15 },
  'SKU1012': { 'S': 12, 'M': 4, 'L': 0, 'XL': 6 }
};

const userHistory: any = {
  'user123': {
    purchasedBrands: ['H&M', 'Roadster', 'Mango'],
    successfulSizes: {
      'Dresses': 'M',
      'Jeans': 'M',
      'Tops': 'M',
      'Jackets': 'M'
    }
  }
};

const productSpecs: any = {
  'SKU1001': { fitType: 'Regular', stretch: 'Stretchable', runs: 'Small' },
  'SKU1002': { fitType: 'Relaxed', stretch: 'Non-stretch', runs: 'True' },
  'SKU1004': { fitType: 'Slim', stretch: 'Non-stretch', runs: 'True' },
  'SKU1005': { fitType: 'Fitted', stretch: 'Stretchable', runs: 'Small' },
  'SKU1007': { fitType: 'Regular', stretch: 'Non-stretch', runs: 'Large' },
  'SKU1009': { fitType: 'Oversized', stretch: 'Non-stretch', runs: 'True' },
  'SKU1010': { fitType: 'Oversized', stretch: 'Stretchable', runs: 'True' },
  'SKU1012': { fitType: 'Slim', stretch: 'Stretchable', runs: 'Small' }
};

const productReviews: any = {
  'SKU1001': { volume: 45, consistency: 'High', consensus: 'Runs Small' },
  'SKU1002': { volume: 8, consistency: 'Mixed', consensus: 'Mixed Sizing' },
  'SKU1004': { volume: 2, consistency: 'Low', consensus: 'Unknown' },
  'SKU1005': { volume: 120, consistency: 'High', consensus: 'Runs Small' },
  'SKU1007': { volume: 25, consistency: 'High', consensus: 'Runs Large' },
  'SKU1009': { volume: 80, consistency: 'High', consensus: 'True to Size' },
  'SKU1010': { volume: 55, consistency: 'High', consensus: 'True to Size' },
  'SKU1012': { volume: 12, consistency: 'Mixed', consensus: 'Runs Small' }
};

const ugcMedia: any = {
  'SKU1001': [
    { id: '1', url: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?auto=format&fit=crop&q=80&w=200', username: '@stylebyananya', size: 'S', comment: 'Fits really well!' },
    { id: '2', url: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?auto=format&fit=crop&q=80&w=200', username: '@fashionista99', size: 'M', comment: 'Perfect summer dress!' }
  ],
  'SKU1002': [
    { id: '3', url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=200', username: '@rahulstyles', size: 'L', comment: 'Super comfy jeans' },
    { id: '4', url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=200', username: '@denimlover', size: 'XL', comment: 'Waist is a bit loose' }
  ],
  'SKU1004': [
    { id: '5', url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=200', username: '@jacketguy', size: 'L', comment: 'Warm and stylish' },
    { id: '6', url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=200', username: '@winterlooks', size: 'XL', comment: 'Sleeves are perfect' }
  ],
  'SKU1005': [
    { id: '7', url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=200', username: '@casualstyle', size: 'S', comment: 'Soft material' },
    { id: '8', url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=200', username: '@everydaywear', size: 'M', comment: 'A bit tight on shoulders' }
  ],
  'SKU1007': [
    { id: '9', url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=200', username: '@dresslover', size: 'S', comment: 'Vibrant color' },
    { id: '10', url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=200', username: '@partyvibes', size: 'M', comment: 'Fits perfectly' }
  ],
  'SKU1009': [
    { id: '11', url: 'https://images.unsplash.com/photo-1601333144130-8cbb312386b6?auto=format&fit=crop&q=80&w=200', username: '@denimhead', size: 'M', comment: 'Classic look' },
    { id: '12', url: 'https://images.unsplash.com/photo-1601333144130-8cbb312386b6?auto=format&fit=crop&q=80&w=200', username: '@vintagefan', size: 'L', comment: 'Sturdy fabric' }
  ],
  'SKU1010': [
    { id: '13', url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=200', username: '@oversizedfan', size: 'L', comment: 'Very baggy' },
    { id: '14', url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=200', username: '@chilldude', size: 'XL', comment: 'Comfortable' }
  ],
  'SKU1012': [
    { id: '15', url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=200', username: '@skinnyjeans', size: 'S', comment: 'Very tight fit' },
    { id: '16', url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=200', username: '@fashionboy', size: 'M', comment: 'Good stretch' }
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

app.get('/internal/history/:userId', (req, res) => {
  res.json(userHistory[req.params.userId] || { purchasedBrands: [], successfulSizes: {} });
});

app.get('/internal/specs/:sku', (req, res) => {
  res.json(productSpecs[req.params.sku] || {});
});

app.get('/internal/reviews/:sku', (req, res) => {
  res.json(productReviews[req.params.sku] || { volume: 0, consistency: 'Unknown', consensus: 'Unknown' });
});

export default app;
