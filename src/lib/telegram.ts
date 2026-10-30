import { resolveOrderGpsLocation } from './gps';

export const TELEGRAM_BOT_TOKEN = '8992339748:AAHVoYo1Mfwpqp3dW4E070mkahSWALqfbdw';
export const TELEGRAM_CHAT_ID = '7718402252';

export interface TelegramOrderPayload {
  name: string;
  phone: string;
  food: string;
  address?: string;
  locationLink?: string;
  coords?: { lat: number; lng: number } | null;
  total?: string | number;
  orderType?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  transactionId?: string;
  paymentUssd?: string;
  orderCode?: string;
  notes?: string;
}

export interface TelegramReservationPayload {
  name: string;
  phone: string;
  guests: number | string;
  date: string;
  time: string;
  bookingCode: string;
  requests?: string;
}

/**
 * Escapes characters for HTML parse mode in Telegram
 */
function escapeHtml(text: string): string {
  return (text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Sends automated alert for new food orders to Baraa Restaurant Telegram Bot
 */
export async function sendTelegramOrderNotification(payload: TelegramOrderPayload): Promise<boolean> {
  // 1. First attempt: Use our backend proxy endpoint (guaranteed to bypass CORS)
  try {
    const backendRes = await fetch('/api/telegram/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (backendRes.ok) {
      const data = await backendRes.json();
      if (data.success) {
        return true;
      }
    }
  } catch (proxyErr) {
    console.warn('Backend Telegram proxy skipped or unavailable:', proxyErr);
  }

  // 2. Direct browser fallback (for static deployment environments)
  const { name, phone, food, address, locationLink, coords, total, paymentMethod, paymentStatus, transactionId, paymentUssd, orderCode, notes } = payload;
  const botToken = TELEGRAM_BOT_TOKEN;
  const chatId = TELEGRAM_CHAT_ID;

  const formattedTotal = typeof total === 'number' ? `$${total.toFixed(2)}` : (total || '$0.00');
  const userNotes = notes || 'Mani jiro';

  const resolvedGps = resolveOrderGpsLocation(address || '', coords, locationLink);
  const finalMapLink = resolvedGps.link;

  const htmlMessage =
    `🍽️ <b>DALAB CUSUB - BARAA RESTAURANT</b>\n\n` +
    `👤 <b>Magaca:</b> ${escapeHtml(name || 'Macmiil')}\n` +
    `📞 <b>Taleefanka:</b> ${escapeHtml(phone || 'Aan la sheegin')}\n` +
    `🏠 <b>Ciwaanka:</b> ${escapeHtml(address || 'Muqdisho')}\n` +
    `🍲 <b>Cuntada / Items:</b> ${escapeHtml(food || 'Aan la sheegin')}\n` +
    `💰 <b>Qiimaha:</b> ${escapeHtml(formattedTotal)}\n` +
    `💳 <b>Lacag Bixinta:</b> ${escapeHtml(paymentMethod || 'EVC Plus')}\n` +
    `🏷️ <b>Code:</b> ${escapeHtml(orderCode || 'BR-ORD-123456')}\n` +
    `📝 <b>Fariin:</b> ${escapeHtml(userNotes)}\n\n` +
    `📍 <b>Location-ka:</b> ${finalMapLink}`;

  try {
    const postRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: htmlMessage,
        parse_mode: 'HTML'
      })
    });
    if (postRes.ok) {
      return true;
    }
  } catch (err) {
    console.warn('Telegram direct fetch skipped:', err);
  }

  return true;
}

/**
 * Sends automated alert for table reservations to Baraa Restaurant Telegram Bot
 */
export async function sendTelegramReservationNotification(payload: TelegramReservationPayload): Promise<boolean> {
  // 1. First attempt: Use our backend proxy endpoint (guaranteed to bypass CORS)
  try {
    const backendRes = await fetch('/api/telegram/reservation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (backendRes.ok) {
      const data = await backendRes.json();
      if (data.success) {
        return true;
      }
    }
  } catch (proxyErr) {
    console.warn('Backend Telegram reservation proxy skipped or unavailable:', proxyErr);
  }

  // 2. Direct browser fallback
  const { name, phone, guests, date, time, bookingCode, requests } = payload;
  const botToken = TELEGRAM_BOT_TOKEN;
  const chatId = TELEGRAM_CHAT_ID;

  const htmlMessage =
    `🥂 <b>BALLAN-QAAD MIIS CUSUB (RESERVATION)!</b>\n\n` +
    `👤 <b>Magaca:</b> ${escapeHtml(name || 'Aan la sheegin')}\n` +
    `📞 <b>Nambarka:</b> ${escapeHtml(phone || 'Aan la sheegin')}\n` +
    `👥 <b>Tirada Dadka:</b> ${guests} qof\n` +
    `📅 <b>Taariikhda & Waqtiga:</b> ${escapeHtml(date)} saacadu markay tahay ${escapeHtml(time)}\n` +
    `🔖 <b>Code:</b> ${escapeHtml(bookingCode)}` +
    (requests ? `\n📝 <b>Codsiga:</b> ${escapeHtml(requests)}` : '');

  try {
    const postRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: htmlMessage,
        parse_mode: 'HTML'
      })
    });
    return postRes.ok;
  } catch (err) {
    console.warn('Telegram direct reservation alert skipped:', err);
    return true;
  }
}

