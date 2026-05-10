const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.jsx': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.mp4': 'video/mp4',
  '.mov': 'video/quicktime'
};

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Basic Authentication for /manage and /api/save
  const isProtected = req.url === '/manage' || req.url === '/manage.html' || req.url === '/api/save' || req.url === '/api/upload';
  if (isProtected) {
    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');
    if (login !== 'admin' || password !== 'isale2026') {
      res.setHeader('WWW-Authenticate', 'Basic realm="Isale Adminka"');
      res.writeHead(401, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Kirish taqiqlangan');
      return;
    }
  }

  // /admin URL ga kirmoqchi bo'lsa — yo'qoltiramiz (404)
  if (req.url === '/admin' || req.url === '/admin.html') {
    res.writeHead(404); res.end('Not Found'); return;
  }

  // API Route to get data (settings ni brauzerga BERMAYDI — xavfsizlik)
  if (req.method === 'GET' && req.url === '/api/data') {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to read data' }));
        return;
      }
      const parsed = JSON.parse(data);
      delete parsed.settings; // Bot token brauzerga hech qachon chiqmaydi!
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(parsed));
    });
    return;
  }

  // API Route: Telegram ga server orqali xabar jo'natish
  if (req.method === 'POST' && req.url === '/api/notify') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const formData = JSON.parse(body);
        fs.readFile(DATA_FILE, 'utf8', (err, raw) => {
          if (err) { res.writeHead(500); res.end('{}'); return; }
          const settings = JSON.parse(raw).settings;
          if (!settings || !settings.botToken) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ ok: true, note: 'no token' }));
            return;
          }
          const text = `🔥 Yangi ariza (Isale.Marketing):\n\n👤 Ism: ${formData.name}\n📞 Tel: ${formData.phone}\n🌐 Insta: ${formData.insta || '-'}\n🎯 Soha: ${formData.niche}\n💰 Byudjet: ${formData.budget}\n🚀 Maqsad: ${formData.goal}`;
          const apiUrl = `https://api.telegram.org/bot${settings.botToken}/sendMessage`;
          const https = require('https');
          const sendTo = (chatId) => {
            if (!chatId) return;
            const payload = JSON.stringify({ chat_id: chatId, text });
            const opts = {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) }
            };
            const tgReq = https.request(apiUrl, opts, () => {});
            tgReq.on('error', () => {});
            tgReq.write(payload);
            tgReq.end();
          };
          sendTo(settings.chatId1);
          sendTo(settings.chatId2);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true }));
        });
      } catch(e) {
        res.writeHead(400); res.end(JSON.stringify({ error: 'bad json' }));
      }
    });
    return;
  }

  // API Route to upload video files
  if (req.method === 'POST' && req.url.startsWith('/api/upload')) {
    const urlObj = new URL(req.url, `http://${req.headers.host}`);
    const filename = urlObj.searchParams.get('filename') || `vid_${Date.now()}.mp4`;
    const dest = path.join(__dirname, filename);
    const writeStream = fs.createWriteStream(dest);
    
    req.pipe(writeStream);
    req.on('end', () => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ filename }));
    });
    req.on('error', () => {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to upload video' }));
    });
    return;
  }

  // API Route to save data
  if (req.method === 'POST' && req.url === '/api/save') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const newData = JSON.parse(body);
        fs.writeFile(DATA_FILE, JSON.stringify(newData, null, 2), 'utf8', (err) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to save data' }));
            return;
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true }));
        });
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  // data.json ga to'g'ridan-to'g'ri kirish bloklangan (bot token himoyasi)
  if (req.url === '/data.json') {
    res.writeHead(403, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Forbidden' }));
    return;
  }

  // Serve static files
  let filePath = req.url === '/' ? '/index.html' : req.url;
  if (filePath === '/manage') filePath = '/admin.html';
  
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  // Try public folder first, then root
  const publicPath = path.join(__dirname, 'public', filePath);
  const rootPath = path.join(__dirname, filePath);

  fs.readFile(publicPath, (err, content) => {
    if (!err) {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    } else {
      fs.readFile(rootPath, (err2, content2) => {
        if (err2) {
          if (err2.code === 'ENOENT') {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('404 Not Found', 'utf-8');
          } else {
            res.writeHead(500);
            res.end('Sorry, check with the site admin for error: ' + err2.code + ' ..\n');
          }
        } else {
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(content2, 'utf-8');
        }
      });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  console.log(`Admin panel available at http://localhost:${PORT}/admin`);
});
