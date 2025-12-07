const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');

if (fs.existsSync(distDir)) {
  console.log('🧹 Cleaning dist directory...');
  fs.rmSync(distDir, { recursive: true, force: true });
  console.log('✅ Clean completed!');
} else {
  console.log('✅ Nothing to clean.');
}
