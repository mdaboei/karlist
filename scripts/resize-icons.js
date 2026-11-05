const sharp = require('sharp');

async function run() {
  const jobs = [
    { in: 'public/icon-raw.png', out: 'public/icon-512.png', size: 512, round: true },
    { in: 'public/icon-raw.png', out: 'public/icon-192.png', size: 192, round: true },
    { in: 'public/icon-raw.png', out: 'public/apple-touch-icon.png', size: 180, round: false },
    { in: 'public/icon-raw.png', out: 'src/app/favicon.png', size: 64, round: true },
    { in: 'public/empty-raw.png', out: 'public/empty-illustration.png', size: 512, round: false },
  ];
  for (const j of jobs) {
    let img = sharp(j.in).resize(j.size, j.size);
    if (j.round) {
      const mask = Buffer.from(
        `<svg width="${j.size}" height="${j.size}"><rect x="0" y="0" width="${j.size}" height="${j.size}" rx="${Math.round(j.size * 0.22)}" ry="${Math.round(j.size * 0.22)}"/></svg>`
      );
      img = img.composite([{ input: mask, blend: 'dest-in' }]).png();
    }
    await img.toFile(j.out);
    console.log('created', j.out);
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
