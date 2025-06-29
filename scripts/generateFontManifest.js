#!/usr/bin/env node
// Script to generate a JSON manifest of all font files in a given directory

const fs = require('fs');
const path = require('path');

// Default fonts directory inside public
const fontDir = process.argv[2] || path.join(__dirname, '..', 'public', 'fonts');
const outFile = path.join(fontDir, 'fonts.json');

// Supported font file extensions
const exts = ['.ttf', '.otf', '.woff', '.woff2'];
const fonts = [];

if (!fs.existsSync(fontDir)) {
  // Automatically create fonts directory for user
  fs.mkdirSync(fontDir, { recursive: true });
  console.log('Created font directory at:', fontDir);
  console.log('Please copy your font files (e.g., .ttf, .woff) into this folder and rerun the script.');
  process.exit(0);
}

// Read directory and collect font files
fs.readdirSync(fontDir).forEach(file => {
  const ext = path.extname(file).toLowerCase();
  if (exts.includes(ext)) {
    fonts.push({ name: path.basename(file, ext), file });
  }
});

// Write manifest JSON
fs.writeFileSync(outFile, JSON.stringify(fonts, null, 2));
console.log(`Generated font manifest with ${fonts.length} fonts at ${outFile}`);
