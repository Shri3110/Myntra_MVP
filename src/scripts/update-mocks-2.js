const fs = require('fs');
const path = require('path');
const file = path.join('c:\\Myntra MVP\\src\\mocks\\myntra-core.ts');
let content = fs.readFileSync(file, 'utf8');

// First, strip out the randomly added properties from the previous step
content = content.replace(/,\s*matchScore: \d+,\s*reviewText: "Verified true to size by 40\+ buyers",\s*subtitle: "Tap for Real-Body Photos & Insights >"/g, '');

// Now add aiFit to SKU1001 (H&M Maxi Dress)
content = content.replace(/'SKU1001': {([\s\S]*?)availableSizes: \['S', 'M', 'L'\]\n  },/g, 
  `'SKU1001': {$1availableSizes: ['S', 'M', 'L'],
    aiFit: { matchScore: 98, badgeColor: '#00A66C', reviewText: "Verified true to size by 40+ buyers", subtitle: "Tap for Real-Body Photos & Insights >" }
  },`);

// Now add aiFit to SKU1002 (Roadster Jeans)
content = content.replace(/'SKU1002': {([\s\S]*?)availableSizes: \['28', '30', '32'\]\n  },/g, 
  `'SKU1002': {$1availableSizes: ['28', '30', '32'],
    aiFit: { matchScore: 92, badgeColor: '#00A66C', reviewText: "Runs slightly long, standard waist", subtitle: "Tap for Real-Body Photos & Insights >" }
  },`);

// Now add aiFit to SKU1003 (Puma Sneakers)
content = content.replace(/'SKU1003': {([\s\S]*?)availableSizes: \['UK7', 'UK8', 'UK9'\]\n  },/g, 
  `'SKU1003': {$1availableSizes: ['UK7', 'UK8', 'UK9'],
    aiFit: { matchScore: 85, badgeColor: '#EAA100', reviewText: "78% buyers recommend sizing up 0.5", subtitle: "Tap for Real-Body Photos & Insights >" }
  },`);

fs.writeFileSync(file, content);
