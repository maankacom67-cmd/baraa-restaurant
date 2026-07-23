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

// ---------------------- API ROUTES ----------------------

// 1. BOOKINGS (Ballansashada)
app.get('/api/bookings', (req, res) => {
  const bookings = readJSON(BOOKINGS_FILE);
  res.json(bookings);
});

app.post('/api/bookings', (req, res) => {
  const { name, guests, date, time, requests, paymentMethod, paymentNumber, bookingCode } = req.body;
  
  if (!name || !guests || !date || !time) {
    return res.status(400).json({ error: 'Fadlan buuxi magaca, tirada dadka, taariikhda iyo saacadda.' });
  }

  const bookings = readJSON(BOOKINGS_FILE);
  const newBooking = {
    id: Math.random().toString(36).substring(2, 9),
    name,
    guests: Number(guests),
    date,
    time,
    requests: requests || '',
    paymentMethod: paymentMethod || 'evc_plus',
    paymentNumber: paymentNumber || '',
    isConfirmed: true,
    bookingCode: bookingCode || `BR-${Date.now().toString().substring(8)}`,
    createdAt: new Date().toISOString()
  };

  bookings.unshift(newBooking);
  writeJSON(BOOKINGS_FILE, bookings);
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

// 2. ORDERS (Dalabaadka)
app.get('/api/orders', (req, res) => {
  const orders = readJSON(ORDERS_FILE);
  res.json(orders);
});

app.post('/api/orders', (req, res) => {
  const orderData = req.body;
  if (!orderData.customerPhone || !orderData.items || orderData.items.length === 0) {
    return res.status(400).json({ error: 'Macluumaadka dalabka ama cuntooyinka ma dhammaystirna.' });
  }

  const orders = readJSON(ORDERS_FILE);
  const newOrder = {
    id: orderData.id || Math.random().toString(36).substring(2, 9),
    customerName: orderData.customerName || 'Macmiil',
    customerPhone: orderData.customerPhone,
    address: orderData.address || '',
    orderType: orderData.orderType || 'takeaway',
    paymentMethod: orderData.paymentMethod || 'EVC Plus',
    items: orderData.items,
    totalAmount: Number(orderData.totalAmount),
    date: orderData.date || new Date().toLocaleDateString('so-SO'),
    time: orderData.time || new Date().toLocaleTimeString('so-SO'),
    status: orderData.status || 'pending',
    createdAt: new Date().toISOString()
  };

  orders.unshift(newOrder);
  writeJSON(ORDERS_FILE, orders);
  res.status(201).json(newOrder);
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
