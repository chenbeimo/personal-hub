const fs = require('fs');
const path = require('path');

// Create a simple PNG icon using raw bytes
// This creates a minimal valid PNG file with a purple gradient and "P" letter

function createMinimalPNG(size) {
  // For simplicity, we'll create an SVG and note that it needs to be converted
  // The Vite PWA plugin will handle the icons

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#a855f7;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#6366f1;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="url(#grad)"/>
  <text x="50%" y="52%" font-family="Arial, sans-serif" font-size="${size * 0.55}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">P</text>
</svg>`;

  return svg;
}

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate SVG icons (these will work for most purposes)
fs.writeFileSync(path.join(iconsDir, 'icon-192x192.svg'), createMinimalPNG(192));
fs.writeFileSync(path.join(iconsDir, 'icon-512x512.svg'), createMinimalPNG(512));

console.log('Icons created as SVG files.');
console.log('');
console.log('IMPORTANT: For PWA installation to work properly,');
console.log('you need to convert these SVGs to PNG format:');
console.log('');
console.log('1. Open generate-icons.html in your browser');
console.log('2. Click the download buttons to get PNG files');
console.log('3. Save them to public/icons/ folder');
console.log('');
console.log('Or use an online converter like:');
console.log('https://convertio.co/svg-png/');
