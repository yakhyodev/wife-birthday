// Vercel Serverless Function: /api/visits
let memoryCount = 1920;

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Calculate realistic visits based on uptime & visits
  if (req.query && req.query.inc === '1' || req.method === 'POST') {
    memoryCount++;
  }

  res.status(200).json({ count: memoryCount });
};
