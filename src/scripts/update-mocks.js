const fs = require('fs');
const path = require('path');
const file = path.join('c:\\Myntra MVP\\src\\mocks\\myntra-core.ts');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/availableSizes: \[(.*?)\]/g, (match, sizes) => {
  return match + ',\n    matchScore: Math.floor(Math.random() * (99 - 70 + 1)) + 70,\n    reviewText: "Verified true to size by 40+ buyers",\n    subtitle: "Tap for Real-Body Photos & Insights >"';
});

fs.writeFileSync(file, content);
