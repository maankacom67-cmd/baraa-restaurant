import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

// Body parsing middleware
app.use(express.json());

// JSON File Database paths
const DB_DIR = path.join(process.cwd(), 'data');
const BOOKINGS_FILE = path.join(DB_DIR, 'bookings.json');
const ORDERS_FILE = path.join(DB_DIR, 'orders.json');
const REVIEWS_FILE = path.join(DB_DIR, 'reviews.json');

// Ensure database directory and files exist
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const defaultReviews = [
  {
    id: 'rev-1',
    name: 'AbdiRahman Cali',
    rating: 5,
    comment: 'Bariiska iyo hilibka ariga waa mid aan la ilaawi karin! Jawi aad u qurux badan iyo adeeg hufan.',
    date: 'Maanta'
  },
  {
    id: 'rev-2',
    name: 'Hana Maxamed',
    rating: 5,
    comment: 'Casiirka cambaha waa dabiici dhab ah oo aad u qabow. Waxaan kaloo jecladay Coffee Latte-ka quruxda badan.',
    date: 'Shalay'
  },
  {
    id: 'rev-3',
    name: 'Yaxye Cumar',
    rating: 4,
    comment: 'Maqaayad heer sare ah oo ku taal wadada wadnaha ee Muqdisho. Ballansashada online-ka ah waa mid aad u fudud.',
    date: '3 maalmood ka hor'
  }
];

function initFile(filePath: string, defaultContent: any) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultContent, null, 2), 'utf-8');
  }
}

initFile(BOOKINGS_FILE, []);
initFile(ORDERS_FILE, []);
initFile(REVIEWS_FILE, defaultReviews);

// Helper helper to read/write JSON files
function readJSON(filePath: string): any[] {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
}

function writeJSON(filePath: string, data: any[]) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
  }
}

// ---------------------- TELEGRAM INTEGRATION (SERVER-SIDE) ----------------------
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8992339748:AAHVoYo1Mfwpqp3dW4E070mkahSWALqfbdw';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '7718402252';

function escapeHtml(text: string): string {
  return (text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function sendTelegramAlert(text: string): Promise<boolean> {
  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: 'HTML'
      })
    });
    if (!response.ok) {
      const errText = await response.text();
      console.warn('[Telegram Server Alert] Response error:', response.status, errText);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Telegram Server Alert] Network error:', err);
    return false;
  }
}

// ---------------------- API ROUTES ----------------------

// 1. BOOKINGS (Ballansashada)
app.get('/api/bookings', (req, res) => {
  const bookings = readJSON(BOOKINGS_FILE);
  res.json(bookings);
});

app.post('/api/bookings', async (req, res) => {
  const { name, guests, date, time, requests, paymentMethod, paymentNumber, bookingCode } = req.body;
  
  if (!name || !date || !time) {
    return res.status(400).json({ error: 'Fadlan buuxi magaca, taariikhda iyo saacadda.' });
  }

  const bookings = readJSON(BOOKINGS_FILE);
  const code = bookingCode || `BR-${Date.now().toString().substring(8)}`;
  const newBooking = {
    id: Math.random().toString(36).substring(2, 9),
    name,
    guests: Number(guests) || 2,
    date,
    time,
    requests: requests || '',
    paymentMethod: paymentMethod || 'evc_plus',
    paymentNumber: paymentNumber || '',
    isConfirmed: true,
    bookingCode: code,
    createdAt: new Date().toISOString()
  };

  bookings.unshift(newBooking);
  writeJSON(BOOKINGS_FILE, bookings);

  // Dispatch alert to Telegram on server side
  const tgHtml =
    `🥂 <b>BALLAN-QAAD MIIS CUSUB! (BARAA)</b>\n\n` +
    `👤 <b>Macmiilka:</b> ${escapeHtml(name)}\n` +
    `📞 <b>Telefoonka:</b> ${escapeHtml(paymentNumber || 'Aan la sheegin')}\n` +
    `👥 <b>Tirada Dadka:</b> ${newBooking.guests} qof\n` +
    `📅 <b>Taariikhda & Waqtiga:</b> ${escapeHtml(date)} saacadu markay tahay ${escapeHtml(time)}\n` +
    `🔖 <b>Code:</b> ${escapeHtml(code)}` +
    (requests ? `\n📝 <b>Codsiga:</b> ${escapeHtml(requests)}` : '') +
    `\n💳 <b>Habka Lacagta:</b> ${escapeHtml(paymentMethod || 'EVC Plus')}`;

  sendTelegramAlert(tgHtml).catch(() => {});

  res.status(201).json(newBooking);
});

app.delete('/api/bookings/:id', (req, res) => {
  const { id } = req.params;
  let bookings = readJSON(BOOKINGS_FILE);
  bookings = bookings.filter((b) => b.id !== id);
  writeJSON(BOOKINGS_FILE, bookings);
  res.json({ success: true, message: 'Ballansashada waa la tirtiray.' });
});

app.delete('/api/bookings', (req, res) => {
  writeJSON(BOOKINGS_FILE, []);
  res.json({ success: true, message: 'Dhammaan ballansashooyinka waa la tirtiray.' });
});

// Cache for deduplicating Telegram order alerts to prevent multiple alerts for the same order
const sentOrderAlerts = new Map<string, number>();

function shouldSendOrderAlert(key: string): boolean {
  const now = Date.now();
  const lastTime = sentOrderAlerts.get(key);
  if (lastTime && now - lastTime < 60000) {
    return false; // Already sent within 60 seconds
  }
  sentOrderAlerts.set(key, now);
  if (sentOrderAlerts.size > 200) {
    for (const [k, t] of sentOrderAlerts.entries()) {
      if (now - t > 120000) sentOrderAlerts.delete(k);
    }
  }
  return true;
}

// 2. ORDERS (Dalabaadka)
app.get('/api/orders', (req, res) => {
  const orders = readJSON(ORDERS_FILE);
  res.json(orders);
});

app.post('/api/orders', async (req, res) => {
  const orderData = req.body;
  const customerName = orderData.customerName || orderData.name || 'Macmiil';
  const customerPhone = orderData.customerPhone || orderData.phone;
  const address = orderData.address || orderData.deliveryAddress || orderData.location || 'Muqdisho';
  
  if (!customerPhone) {
    return res.status(400).json({ error: 'Fadlan geli nambarkaaga taleefonka.' });
  }

  let foodItem = orderData.food;
  if (!foodItem && Array.isArray(orderData.items) && orderData.items.length > 0) {
    foodItem = orderData.items
      .map((i: any) => `${i.item?.name || i.name} (x${i.quantity || 1})`)
      .join(', ');
  } else if (!foodItem) {
    foodItem = 'Cunto dalab ah';
  }

  const rawTotal = orderData.totalAmount !== undefined 
    ? Number(orderData.totalAmount) 
    : (orderData.total ? Number(String(orderData.total).replace(/[^0-9.]/g, '')) : 0);
  const totalAmount = isNaN(rawTotal) ? 0 : rawTotal;

  const orders = readJSON(ORDERS_FILE);
  const orderCode = orderData.orderCode || `BR-ORD-${Date.now().toString().slice(-6)}`;
  
  const locationLink = orderData.locationLink || 
    (orderData.coords ? `https://maps.google.com/?q=${orderData.coords.lat},${orderData.coords.lng}` : 
    (address && address !== 'Muqdisho' ? `https://maps.google.com/?q=${encodeURIComponent(address + ', Mogadishu')}` : ''));

  const userNotes = orderData.notes || orderData.cartNotes || orderData.requests || (address && address !== 'Muqdisho' ? address : 'Mani jiro');

  const newOrder = {
    id: orderData.id || Math.random().toString(36).substring(2, 9),
    customerName,
    customerPhone,
    address,
    locationLink,
    coords: orderData.coords || null,
    notes: userNotes,
    food: foodItem,
    orderType: orderData.orderType || 'takeaway',
    paymentMethod: orderData.paymentMethod || 'EVC Plus',
    items: orderData.items || [{ name: foodItem, quantity: 1, price: totalAmount }],
    totalAmount,
    date: orderData.date || new Date().toLocaleDateString('so-SO'),
    time: orderData.time || new Date().toLocaleTimeString('so-SO'),
    status: orderData.status || 'pending',
    orderCode,
    createdAt: new Date().toISOString()
  };

  orders.unshift(newOrder);
  writeJSON(ORDERS_FILE, orders);

  // Send Telegram Notification on server with deduplication
  const dedupeKey = orderCode || `${customerPhone}_${foodItem}`;
  let telegramSent = false;
  if (shouldSendOrderAlert(dedupeKey)) {
    const formattedTotal = totalAmount > 0 ? `$${totalAmount.toFixed(2)}` : (orderData.total || '$0.00');
    const tgHtml =
      `🍽️ <b>DALAB CUSUB - BARAA RESTAURANT</b>\n\n` +
      `👤 <b>Magaca:</b> ${escapeHtml(customerName)}\n` +
      `📞 <b>Taleefanka:</b> ${escapeHtml(customerPhone)}\n` +
      `🍲 <b>Cuntada / Items:</b> ${escapeHtml(foodItem)}\n` +
      `💰 <b>Qiimaha:</b> ${escapeHtml(formattedTotal)}\n` +
      `💳 <b>Lacag Bixinta:</b> ${escapeHtml(newOrder.paymentMethod)}\n` +
      `🏷️ <b>Code:</b> ${escapeHtml(orderCode)}\n` +
      `📝 <b>Fariin:</b> ${escapeHtml(userNotes)}\n` +
      (locationLink ? `\n📍 <b>Location-ka:</b> ${escapeHtml(locationLink)}` : '');

    sendTelegramAlert(tgHtml).catch(() => {});
    telegramSent = true;
  }

  res.status(201).json({ success: true, order: newOrder, telegramSent });
});

// Dedicated Telegram API endpoints for direct triggers
app.post('/api/telegram/order', async (req, res) => {
  const { name, phone, food, address, locationLink, total, paymentMethod, orderCode, notes } = req.body;
  const dedupeKey = orderCode || `${phone}_${food}_${total}`;
  if (!shouldSendOrderAlert(dedupeKey)) {
    return res.json({ success: true, deduplicated: true });
  }

  const formattedTotal = typeof total === 'number' ? `$${total.toFixed(2)}` : (total || '$0.00');
  const userNotes = notes || (address && address !== 'Muqdisho' ? address : 'Mani jiro');
  const linkText = locationLink || (address && address !== 'Muqdisho' ? `https://maps.google.com/?q=${encodeURIComponent(address + ', Mogadishu')}` : '');

  const tgHtml =
    `🍽️ <b>DALAB CUSUB - BARAA RESTAURANT</b>\n\n` +
    `👤 <b>Magaca:</b> ${escapeHtml(name || 'Macmiil')}\n` +
    `📞 <b>Taleefanka:</b> ${escapeHtml(phone || 'Aan la sheegin')}\n` +
    `🍲 <b>Cuntada / Items:</b> ${escapeHtml(food || 'Aan la sheegin')}\n` +
    `💰 <b>Qiimaha:</b> ${escapeHtml(formattedTotal)}\n` +
    `💳 <b>Lacag Bixinta:</b> ${escapeHtml(paymentMethod || 'EVC Plus')}\n` +
    `🏷️ <b>Code:</b> ${escapeHtml(orderCode || 'BR-ORD-123456')}\n` +
    `📝 <b>Fariin:</b> ${escapeHtml(userNotes)}\n` +
    (linkText ? `\n📍 <b>Location-ka:</b> ${escapeHtml(linkText)}` : '');

  const sent = await sendTelegramAlert(tgHtml);
  res.json({ success: sent });
});

app.post('/api/telegram/reservation', async (req, res) => {
  const { name, phone, guests, date, time, bookingCode, requests } = req.body;
  const tgHtml =
    `🥂 <b>BALLAN-QAAD MIIS CUSUB! (BARAA)</b>\n\n` +
    `👤 <b>Macmiilka:</b> ${escapeHtml(name || 'Aan la sheegin')}\n` +
    `📞 <b>Telefoonka:</b> ${escapeHtml(phone || 'Aan la sheegin')}\n` +
    `👥 <b>Tirada Dadka:</b> ${guests || 2} qof\n` +
    `📅 <b>Taariikhda & Waqtiga:</b> ${escapeHtml(date)} saacadu markay tahay ${escapeHtml(time)}\n` +
    `🔖 <b>Code:</b> ${escapeHtml(bookingCode || '')}` +
    (requests ? `\n📝 <b>Codsiga:</b> ${escapeHtml(requests)}` : '');

  const sent = await sendTelegramAlert(tgHtml);
  res.json({ success: sent });
});

// 3. REVIEWS (Faallooyinka)
app.get('/api/reviews', (req, res) => {
  const reviews = readJSON(REVIEWS_FILE);
  res.json(reviews);
});

app.post('/api/reviews', (req, res) => {
  const { name, rating, comment, dishName } = req.body;
  
  if (!name || !rating || !comment) {
    return res.status(400).json({ error: 'Fadlan buuxi magaca, darajada iyo faalladaada.' });
  }

  const reviews = readJSON(REVIEWS_FILE);
  const newReview = {
    id: Math.random().toString(36).substring(2, 9),
    name,
    rating: Number(rating),
    comment,
    dishName: dishName || undefined,
    date: 'Maanta',
    createdAt: new Date().toISOString()
  };

  reviews.unshift(newReview);
  writeJSON(REVIEWS_FILE, reviews);
  res.status(201).json(newReview);
});

// Explicit Sitemap.xml & Robots.txt Routes
app.get('/sitemap.xml', (req, res) => {
  const publicSitemap = path.join(process.cwd(), 'public', 'sitemap.xml');
  const distSitemap = path.join(process.cwd(), 'dist', 'sitemap.xml');
  const target = fs.existsSync(publicSitemap) ? publicSitemap : distSitemap;
  if (fs.existsSync(target)) {
    res.header('Content-Type', 'application/xml');
    return res.sendFile(target);
  }
  res.status(404).send('Sitemap not found');
});

app.get('/robots.txt', (req, res) => {
  const publicRobots = path.join(process.cwd(), 'public', 'robots.txt');
  const distRobots = path.join(process.cwd(), 'dist', 'robots.txt');
  const target = fs.existsSync(publicRobots) ? publicRobots : distRobots;
  if (fs.existsSync(target)) {
    res.header('Content-Type', 'text/plain');
    return res.sendFile(target);
  }
  res.status(404).send('Robots.txt not found');
});

// Explicit Service Worker and Web Manifest Routes
app.get('/sw.js', (req, res) => {
  const publicSw = path.join(process.cwd(), 'public', 'sw.js');
  const distSw = path.join(process.cwd(), 'dist', 'sw.js');
  const target = fs.existsSync(publicSw) ? publicSw : distSw;
  if (fs.existsSync(target)) {
    res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
    res.setHeader('Service-Worker-Allowed', '/');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    return res.sendFile(target);
  }
  res.status(404).send('Service worker not found');
});

app.get(['/manifest.json', '/site.webmanifest'], (req, res) => {
  const isWebManifest = req.path.endsWith('webmanifest');
  const fileName = isWebManifest ? 'site.webmanifest' : 'manifest.json';
  const publicManifest = path.join(process.cwd(), 'public', fileName);
  const distManifest = path.join(process.cwd(), 'dist', fileName);
  const target = fs.existsSync(publicManifest) ? publicManifest : distManifest;
  if (fs.existsSync(target)) {
    res.setHeader('Content-Type', 'application/manifest+json; charset=UTF-8');
    return res.sendFile(target);
  }
  res.status(404).send('Manifest not found');
});

// ---------------------- FRONTEND / STATIC SERVING ----------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    // Development Mode: Mount Vite's HMR and Asset Pipeline
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production Mode: Serve Compiled Frontend assets from dist/
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    
    // SPA Fallback: Direct all unrecognized requests back to index.html
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Baraa Backend DB Server] Live on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer();
