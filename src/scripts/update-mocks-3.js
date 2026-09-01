const fs = require('fs');
const path = require('path');
const file = path.join('c:\\Myntra MVP\\src\\mocks\\myntra-core.ts');
let content = fs.readFileSync(file, 'utf8');

// Replace SKU1001 aiFit block
content = content.replace(/aiFit: \{ matchScore: 98, badgeColor: '#00A66C', reviewText: "Verified true to size by 40\+ buyers", subtitle: "Tap for Real-Body Photos & Insights >" \}/g, 
  `aiFit: { matchScore: 96, subtitle: "Tap for Real-Body Photos & Insights >" }`);

// Replace SKU1002 aiFit block
content = content.replace(/aiFit: \{ matchScore: 92, badgeColor: '#00A66C', reviewText: "Runs slightly long, standard waist", subtitle: "Tap for Real-Body Photos & Insights >" \}/g, 
  `aiFit: { matchScore: 82, subtitle: "Tap for Real-Body Photos & Insights >" }`);

// Replace SKU1003 aiFit block
content = content.replace(/aiFit: \{ matchScore: 85, badgeColor: '#EAA100', reviewText: "78% buyers recommend sizing up 0\.5", subtitle: "Tap for Real-Body Photos & Insights >" \}/g, 
  `aiFit: { matchScore: 78, subtitle: "Tap for Real-Body Photos & Insights >" }`);

// SKU1004 doesn't have an aiFit block right now, it just has availableSizes: ['M', 'L', 'XL']
content = content.replace(/'SKU1004': {([\s\S]*?)availableSizes: \['M', 'L', 'XL'\]\n  },/g, 
  `'SKU1004': {$1availableSizes: ['M', 'L', 'XL'],
    aiFit: { matchScore: 88, subtitle: "Tap for Real-Body Photos & Insights >" }
  },`);

fs.writeFileSync(file, content);
