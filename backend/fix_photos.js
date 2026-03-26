const fs = require('fs');
const path = require('path');
const https = require('https');
const db = require('./config/db');

const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

const images = [
  { name: 'campus_1.jpg', url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80' },
  { name: 'campus_2.jpg', url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80' },
  { name: 'campus_3.jpg', url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&q=80' },
  { name: 'campus_4.jpg', url: 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=800&q=80' },
  { name: 'campus_5.jpg', url: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&q=80' }
];

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        // follow redirect
        https.get(res.headers.location, (res2) => {
          const stream = fs.createWriteStream(filepath);
          res2.pipe(stream);
          stream.on('finish', () => resolve(true));
        }).on('error', reject);
      } else {
        const stream = fs.createWriteStream(filepath);
        res.pipe(stream);
        stream.on('finish', () => resolve(true));
      }
    }).on('error', reject);
  });
};

async function main() {
  console.log('Downloading 5 default high-quality campus photos...');
  for (let img of images) {
    const dest = path.join(UPLOADS_DIR, img.name);
    if (!fs.existsSync(dest)) {
      await downloadImage(img.url, dest);
      console.log(`Downloaded ${img.name}`);
    } else {
      console.log(`${img.name} already exists`);
    }
  }

  console.log('Fetching all colleges...');
  const [colleges] = await db.query('SELECT college_id, image FROM colleges');
  
  console.log(`Found ${colleges.length} colleges. Assigning local images...`);
  for (let i = 0; i < colleges.length; i++) {
    const col = colleges[i];
    // if (!col.image || col.image === 'null' || col.image === 'undefined' || col.image === '') {
      // Overwrite all just to be 100% sure they all have a fantastic photo
      const imgName = images[i % 5].name;
      await db.query('UPDATE colleges SET image = ? WHERE college_id = ?', [imgName, col.college_id]);
      console.log(`Updated College ID ${col.college_id} -> ${imgName}`);
    // }
  }
  
  console.log('Done! All colleges now have local photos.');
  process.exit();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
