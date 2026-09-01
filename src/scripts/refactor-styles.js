const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function refactorFile(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Generic shadow replacing
  const shadowRegex = /shadowColor:\s*'#000',\s*shadowOpacity:\s*([\d.]+),\s*shadowRadius:\s*([\d.]+),\s*elevation:\s*([\d.]+),?/g;
  content = content.replace(shadowRegex, (match, op, rad, el) => {
    let yOffset = el; // roughly
    if (rad === '10' && el === '5') {
       yOffset = '-4'; // Drawer sliding from bottom
    }
    return `boxShadow: '0px ${yOffset}px ${rad}px rgba(0, 0, 0, ${op})',`;
  });

  // Handle resizeMode in index.tsx
  if (filePath.includes('index.tsx') && content.includes('resizeMode: \'cover\'')) {
    // move it to prop
    content = content.replace(
      /<Image \s*source=\{\{ uri: 'https:\/\/images\.unsplash\.com\/photo-1607083206869-4c7672e72a8a\?auto=format&fit=crop&q=80&w=1200' \}\} \s*style=\{styles\.promoImage\} \s*\/>/m,
      `<Image 
          source={{ uri: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&q=80&w=1200' }} 
          style={styles.promoImage} 
          resizeMode="cover"
        />`
    );
    content = content.replace(/[ \t]*resizeMode:\s*'cover',?\s*\n/g, "");
  }

  // Handle pointerEvents everywhere (just in case they exist)
  const peRegex = /pointerEvents=(["'])([^"']+)["']/g;
  if (peRegex.test(content)) {
      console.log('FOUND POINTER EVENTS IN', filePath);
      // We would have to manually fix this or automate, but we suspect there are none.
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log('Updated: ' + filePath);
  }
}

walkDir(path.join('c:\\Myntra MVP\\mobile\\src'), refactorFile);
walkDir(path.join('c:\\Myntra MVP\\mobile\\components'), refactorFile);
