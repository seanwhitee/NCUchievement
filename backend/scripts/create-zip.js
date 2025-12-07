const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

/**
 * Create deployment zip files from browserify dist output
 */

const distDir = path.join(__dirname, '..', 'dist');

if (!fs.existsSync(distDir)) {
  console.error('❌ Error: dist directory not found. Run npm run build first.');
  process.exit(1);
}

const functions = fs.readdirSync(distDir).filter(f => {
  const stat = fs.statSync(path.join(distDir, f));
  return stat.isDirectory();
});

if (functions.length === 0) {
  console.error('❌ Error: No functions found in dist directory.');
  process.exit(1);
}

console.log('📦 Creating deployment packages...\n');

let completed = 0;
const total = functions.length;

functions.forEach(functionName => {
  const functionDir = path.join(distDir, functionName);
  const outputZip = path.join(functionDir, `${functionName}.zip`);

  // Remove old zip if exists
  if (fs.existsSync(outputZip)) {
    fs.unlinkSync(outputZip);
  }

  const output = fs.createWriteStream(outputZip);
  const archive = archiver('zip', {
    zlib: { level: 9 }
  });

  output.on('close', () => {
    const size = (archive.pointer() / 1024).toFixed(2);
    console.log(`✅ ${functionName}.zip - ${size} KB`);
    
    completed++;
    if (completed === total) {
      console.log('\n🎉 All packages created successfully!');
      console.log('📁 Location: backend/dist/[function-name]/[function-name].zip\n');
    }
  });

  archive.on('error', (err) => {
    throw err;
  });

  archive.pipe(output);

  // Add the bundled index.mjs
  const indexFile = path.join(functionDir, 'index.mjs');
  if (fs.existsSync(indexFile)) {
    archive.file(indexFile, { name: 'index.mjs' });
  }

  archive.finalize();
});
