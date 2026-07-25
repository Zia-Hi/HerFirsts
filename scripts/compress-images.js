const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '../public/images');
const pinterestDir = path.join(__dirname, '../public/pinterest');
const MAX_SIZE_KB = 500;
const QUALITY = 80;
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;

async function compressImage(filePath) {
  try {
    const stats = fs.statSync(filePath);
    const sizeKB = stats.size / 1024;
    
    if (sizeKB <= MAX_SIZE_KB) {
      console.log(`✓ Skipping ${filePath} (${sizeKB.toFixed(1)} KB - already small)`);
      return 0;
    }

    const originalSize = stats.size;
    const ext = path.extname(filePath).toLowerCase();
    
    let processed;
    if (ext === '.png') {
      processed = sharp(filePath)
        .resize({ width: MAX_WIDTH, height: MAX_HEIGHT, fit: 'inside', withoutEnlargement: true })
        .png({ quality: QUALITY, compressionLevel: 6 });
    } else if (ext === '.jpg' || ext === '.jpeg') {
      processed = sharp(filePath)
        .resize({ width: MAX_WIDTH, height: MAX_HEIGHT, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: QUALITY, progressive: true, mozjpeg: true });
    } else {
      console.log(`✓ Skipping ${filePath} (unsupported format)`);
      return 0;
    }

    const tempPath = filePath + '.tmp';
    await processed.toFile(tempPath);
    
    fs.unlinkSync(filePath);
    fs.renameSync(tempPath, filePath);
    
    const newStats = fs.statSync(filePath);
    const savedBytes = originalSize - newStats.size;
    const savedPercent = ((savedBytes / originalSize) * 100).toFixed(1);
    
    console.log(`✓ Compressed ${filePath}`);
    console.log(`  Original: ${(originalSize / 1024).toFixed(1)} KB`);
    console.log(`  Compressed: ${(newStats.size / 1024).toFixed(1)} KB`);
    console.log(`  Saved: ${(savedBytes / 1024).toFixed(1)} KB (${savedPercent}%)`);
    
    return savedBytes;
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
    return 0;
  }
}

async function main() {
  console.log('Starting image compression...\n');
  
  let totalSaved = 0;
  let filesProcessed = 0;
  
  const processDir = async (dir) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        await processDir(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (['.png', '.jpg', '.jpeg'].includes(ext)) {
          const saved = await compressImage(fullPath);
          if (saved > 0) {
            filesProcessed++;
            totalSaved += saved;
          }
        }
      }
    }
  };
  
  console.log('Processing images/ directory...\n');
  await processDir(imagesDir);
  
  console.log('\nProcessing pinterest/ directory...\n');
  await processDir(pinterestDir);
  
  console.log('\n========================================');
  console.log(`Compression complete!`);
  console.log(`Files processed: ${filesProcessed}`);
  console.log(`Total saved: ${(totalSaved / 1024).toFixed(1)} KB`);
  console.log(`Total saved: ${(totalSaved / 1024 / 1024).toFixed(2)} MB`);
}

main().catch(console.error);