export const TELEGRAM_BOT_TOKEN = '8992339748:AAHVoYo1Mfwpqp3dW4E070mkahSWALqfbdw';
export const TELEGRAM_CHAT_ID = '7718402252';

export interface TelegramOrderPayload {
  name: string;
  phone: string;
  food: string;
  address: string;
  total?: string | number;
  orderType?: string;
  paymentMethod?: string;
  orderCode?: string;
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
  const { name, phone, food, address, total, orderType, paymentMethod, orderCode } = payload;
  const botToken = TELEGRAM_BOT_TOKEN;
  const chatId = TELEGRAM_CHAT_ID;

  let extraLines = '';
  if (total) {
    extraLines += `\n💰 <b>Wadarta:</b> ${escapeHtml(typeof total === 'number' ? `$${total.toFixed(2)}` : total)}`;
  }
  if (paymentMethod) {
    extraLines += `\n💳 <b>Lacag Bixinta:</b> ${escapeHtml(paymentMethod)}`;
  }
  if (orderType) {
    extraLines += `\n🛵 <b>Nooca:</b> ${escapeHtml(orderType)}`;
  }
  if (orderCode) {
    extraLines += `\n🔖 <b>Code:</b> ${escapeHtml(orderCode)}`;
  }

  const htmlMessage =
    `🍕 <b>DALAB CUNTO CUSUB!</b>\n\n` +
    `👤 <b>Magaca:</b> ${escapeHtml(name || 'Aan la sheegin')}\n` +
    `📞 <b>Nambarka:</b> ${escapeHtml(phone || 'Aan la sheegin')}\n` +
    `🍔 <b>Cuntada:</b> ${escapeHtml(food || 'Aan la sheegin')}\n` +
    `📍 <b>Ciwaanka:</b> ${escapeHtml(address || 'Aan la sheegin')}` +
    extraLines;

  // 1. Try POST with JSON (safest & handles large bodies / unicode cleanly)
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
    console.warn('Telegram POST failed, attempting GET fallback:', err);
  }

  // 2. Try GET with URLSearchParams
  try {
    const rawMarkdown =
      `🍕 *DALAB CUNTO CUSUB!*\n\n` +
      `👤 *Magaca:* ${name || 'Aan la sheegin'}\n` +
      `📞 *Nambarka:* ${phone || 'Aan la sheegin'}\n` +
      `🍔 *Cuntada:* ${food || 'Aan la sheegin'}\n` +
      `📍 *Ciwaanka:* ${address || 'Aan la sheegin'}` +
      (total ? `\n💰 *Wadarta:* ${typeof total === 'number' ? `$${total.toFixed(2)}` : total}` : '') +
      (paymentMethod ? `\n💳 *Lacag Bixinta:* ${paymentMethod}` : '');

    const params = new URLSearchParams({
      chat_id: chatId,
      text: rawMarkdown,
      parse_mode: 'Markdown'
    });

    const getRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage?${params.toString()}`);
    if (getRes.ok) {
      return true;
    }

    // 3. Fallback: plain text without parse mode if Markdown/HTML syntax failed
    const plainParams = new URLSearchParams({
      chat_id: chatId,
      text: `🍕 DALAB CUNTO CUSUB!\n\nMagaca: ${name}\nNambarka: ${phone}\nCuntada: ${food}\nCiwaanka: ${address}`
    });
    const plainRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage?${plainParams.toString()}`);
    return plainRes.ok;
  } catch (error) {
    console.error('Telegram notification error:', error);
    return false;
  }
}

/**
 * Sends automated alert for table reservations to Baraa Restaurant Telegram Bot
 */
export async function sendTelegramReservationNotification(payload: TelegramReservationPayload): Promise<boolean> {
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
    console.warn('Telegram reservation alert error:', err);
    return false;
  }
}

