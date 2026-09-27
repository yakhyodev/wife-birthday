const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.m4a': 'audio/mp4',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);

  // Handle Real Visitor Count API
  if (reqPath === '/api/visits') {
    const visitsFile = path.join(__dirname, 'visits.json');
    let count = 1919;
    try {
      if (fs.existsSync(visitsFile)) {
        const data = JSON.parse(fs.readFileSync(visitsFile, 'utf8'));
        count = data.count || 1919;
      }
    } catch (e) {}

    // Increment if requested or on new session
    if (req.url.includes('inc=1') || req.method === 'POST') {
      count++;
      try {
        fs.writeFileSync(visitsFile, JSON.stringify({ count, lastUpdated: new Date().toISOString() }, null, 2));
      } catch (e) {}
    }

    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    res.end(JSON.stringify({ count }));
    return;
  }

  if (reqPath === '/') reqPath = '/index.html';

  const filePath = path.join(__dirname, reqPath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Sahifa topilmadi');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const total = stats.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const partialStart = parts[0];
      const partialEnd = parts[1];
      const start = parseInt(partialStart, 10);
      const end = partialEnd ? parseInt(partialEnd, 10) : total - 1;
      const chunkSize = (end - start) + 1;

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${total}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*'
      });
      fs.createReadStream(filePath, { start, end }).pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': total,
        'Content-Type': contentType,
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*'
      });
      fs.createReadStream(filePath).pipe(res);
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server muvaffaqiyatli ishga tushdi!`);
  console.log(`Lokal link: http://localhost:${PORT}`);
});
