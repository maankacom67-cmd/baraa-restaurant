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

/**
 * Sends automated alert to Baraa Restaurant Telegram Bot
 */
export async function sendTelegramOrderNotification(payload: TelegramOrderPayload): Promise<boolean> {
  const { name, phone, food, address, total, orderType, paymentMethod, orderCode } = payload;
  const botToken = TELEGRAM_BOT_TOKEN;
  const chatId = TELEGRAM_CHAT_ID;

  let extraInfo = '';
  if (total) {
    extraInfo += `%0A💰 *Wadarta:* ${encodeURIComponent(typeof total === 'number' ? `$${total.toFixed(2)}` : total)}`;
  }
  if (paymentMethod) {
    extraInfo += `%0A💳 *Lacag Bixinta:* ${encodeURIComponent(paymentMethod)}`;
  }
  if (orderType) {
    extraInfo += `%0A🛵 *Nooca:* ${encodeURIComponent(orderType)}`;
  }
  if (orderCode) {
    extraInfo += `%0A🔖 *Code:* ${encodeURIComponent(orderCode)}`;
  }

  // Construct formatted Telegram message string
  const text = `🍕 *DALAB CUNTO CUSUB!*%0A%0A` +
               `👤 *Magaca:* ${encodeURIComponent(name || 'Aan la sheegin')}%0A` +
               `📞 *Nambarka:* ${encodeURIComponent(phone || 'Aan la sheegin')}%0A` +
               `🍔 *Cuntada:* ${encodeURIComponent(food || 'Aan la sheegin')}%0A` +
               `📍 *Ciwaanka:* ${encodeURIComponent(address || 'Aan la sheegin')}` +
               extraInfo;

  const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${text}&parse_mode=Markdown`;

  try {
    const response = await fetch(url);
    if (response.ok) {
      return true;
    }
    
    // Fallback: try POST with JSON body in case of URL length issues
    const postResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: `🍕 *DALAB CUNTO CUSUB!*\n\n` +
              `👤 *Magaca:* ${name || 'Aan la sheegin'}\n` +
              `📞 *Nambarka:* ${phone || 'Aan la sheegin'}\n` +
              `🍔 *Cuntada:* ${food || 'Aan la sheegin'}\n` +
              `📍 *Ciwaanka:* ${address || 'Aan la sheegin'}` +
              (total ? `\n💰 *Wadarta:* ${typeof total === 'number' ? `$${total.toFixed(2)}` : total}` : '') +
              (paymentMethod ? `\n💳 *Lacag Bixinta:* ${paymentMethod}` : ''),
        parse_mode: 'Markdown'
      })
    });
    return postResponse.ok;
  } catch (error) {
    console.error('Telegram notification error:', error);
    return false;
  }
}
