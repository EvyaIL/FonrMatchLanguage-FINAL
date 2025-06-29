#!/usr/bin/env node
// Script to generate a JSON manifest of all font files in a given directory

const fs = require('fs');
const path = require('path');

// Default fonts directory inside public
const fontDir = process.argv[2] || path.join(__dirname, '..', 'public', 'fonts');
const outFile = path.join(fontDir, 'fonts.json');

// Supported font file extensions
const exts = ['.ttf', '.otf', '.woff', '.woff2'];
const manifest = [];

if (!fs.existsSync(fontDir)) {
  // Automatically create fonts directory for user
  fs.mkdirSync(fontDir, { recursive: true });
  console.log('Created font directory at:', fontDir);
  console.log('Please copy your font files into `english/` and `hebrew/` subfolders under this folder, then rerun the script.');
  process.exit(0);
}

// Helper to scan a subfolder and assign language code
function scanSubfolder(sub, langCode) {
  const dir = path.join(fontDir, sub);
  if (!fs.existsSync(dir)) return 0;
  let count = 0;
  fs.readdirSync(dir).forEach(file => {
    const ext = path.extname(file).toLowerCase();
    if (exts.includes(ext)) {
      manifest.push({
        name: path.basename(file, ext),
        file: path.join(sub, file).replace(/\\/g, '/'),
        lang: langCode
      });
      count++;
    }
  });
  return count;
}

// Scan english and hebrew subfolders
let total = 0;
total += scanSubfolder('english', 'en');
total += scanSubfolder('hebrew', 'he');

// Optionally scan root folder for any other files without language
total += fs.readdirSync(fontDir).reduce((acc, file) => {
  const full = path.join(fontDir, file);
  if (fs.statSync(full).isFile()) {
    const ext = path.extname(file).toLowerCase();
    if (exts.includes(ext)) {
      manifest.push({ name: path.basename(file, ext), file, lang: null });
      return acc + 1;
    }
  }
  return acc;
}, 0);

// Write manifest JSON
fs.writeFileSync(outFile, JSON.stringify(manifest, null, 2));
console.log(`Generated font manifest with ${manifest.length} fonts at ${outFile}`);
