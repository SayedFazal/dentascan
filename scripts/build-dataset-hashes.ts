import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function buildHashes() {
  const datasetPath = './src/dataset/plaque_samples.json';
  const assetsDir = './assets/samples';
  
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  const data = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));

  for (const sample of data) {
    const filename = path.basename(sample.image);
    const filePath = path.join(assetsDir, filename);

    // Create dummy image if doesn't exist
    if (!fs.existsSync(filePath)) {
      console.log(`Generating dummy image for ${sample.id}`);
      const color = sample.plaqueClass === 'Low' ? '#0EA5A8' : sample.plaqueClass === 'Medium' ? '#F59E0B' : '#EF4444';
      const shape = sample.id === 'sample-001' ? '<circle cx="400" cy="300" r="200" fill="white" fill-opacity="0.2"/>' : 
                    sample.id === 'sample-002' ? '<rect x="200" y="150" width="400" height="300" fill="white" fill-opacity="0.2"/>' :
                    '<path d="M400 100 L700 500 L100 500 Z" fill="white" fill-opacity="0.2"/>';
      
      await sharp({
        create: {
          width: 800,
          height: 600,
          channels: 3,
          background: color
        }
      })
      .composite([{
        input: Buffer.from(`<svg width="800" height="600">${shape}</svg>`),
        blend: 'over'
      }])
      .jpeg()
      .toFile(filePath);
    }

    // Compute dHash (simplified for Node)
    // 1. Resize to 9x8 grayscale
    const buf = await sharp(filePath)
      .resize(9, 8)
      .grayscale()
      .raw()
      .toBuffer();

    let hashBits = '';
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const left = buf[y * 9 + x];
        const right = buf[y * 9 + x + 1];
        hashBits += left < right ? '1' : '0';
      }
    }

    const hexHash = parseInt(hashBits.substring(0, 32), 2).toString(16).padStart(8, '0') + 
                    parseInt(hashBits.substring(32), 2).toString(16).padStart(8, '0');
    
    sample.dhash = hexHash;
    console.log(`Hash for ${sample.id}: ${hexHash}`);
  }

  fs.writeFileSync(datasetPath, JSON.stringify(data, null, 2));
  console.log('Dataset hashes updated successfully.');
}

buildHashes().catch(console.error);
