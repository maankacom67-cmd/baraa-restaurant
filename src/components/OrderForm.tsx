import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, CheckCircle2, AlertCircle, ShoppingBag, Phone, User, Utensils, Sparkles, Loader2, CreditCard, MessageSquare, ExternalLink } from 'lucide-react';
import { MENU_ITEMS } from '../data';
import { sendTelegramOrderNotification } from '../lib/telegram';
import LocationPicker from './LocationPicker';

interface OrderFormProps {
  onSuccess?: () => void;
  defaultFood?: string;
  className?: string;
}

export default function OrderForm({ onSuccess, defaultFood = '', className = '' }: OrderFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    food: defaultFood || '',
    address: '',
    notes: '',
    paymentMethod: 'EVC Plus (712)'
  });

  const [locationState, setLocationState] = useState<{
    locationLink: string;
    coords: { lat: number; lng: number } | null;
    addressText: string;
  }>({
    locationLink: '',
    coords: null,
    addressText: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [lastOrderInfo, setLastOrderInfo] = useState<{ name: string; food: string; code: string; locationLink?: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = formData.name.trim();
    const phone = formData.phone.trim();
    const food = formData.food.trim();
    const address = (locationState.addressText || formData.address).trim();
    const notes = formData.notes.trim() || 'Dalab degdeg ah fadlan';
    const paymentMethod = formData.paymentMethod || 'EVC Plus (712)';

    if (!name || !phone || !food) {
      setStatus('error');
      setStatusMessage('Fadlan buuxi Magacaaga, Nambarka Taleefanka, iyo Cuntada aad rabto.');
      return;
    }

    if (!address && !locationState.locationLink) {
      setStatus('error');
      setStatusMessage('Fadlan qor ciwaankaaga ama riix badanka GPS-ka si Location-kaaga loo helo.');
      return;
    }

    setStatus('loading');
    setStatusMessage('');

    const generatedCode = `BR-ORD-${Date.now().toString().slice(-6)}`;
    const finalLocationLink = locationState.coords
      ? `https://maps.google.com/?q=${locationState.coords.lat},${locationState.coords.lng}`
      : (locationState.locationLink || (address ? `https://maps.google.com/?q=${encodeURIComponent(address + ', Mogadishu')}` : ''));

    // Calculate approx price if matches a menu item
    const matchedItem = MENU_ITEMS.find(m => m.name.toLowerCase() === food.toLowerCase());
    const totalAmount = matchedItem ? matchedItem.price : 0;
    const formattedTotal = totalAmount > 0 ? `$${totalAmount.toFixed(2)}` : '$0.50';

    const orderPayload = {
      customerName: name,
      customerPhone: phone,
      food,
      address: address || 'Muqdisho',
      locationLink: finalLocationLink,
      coords: locationState.coords,
      notes,
      orderCode: generatedCode,
      orderType: 'delivery',
      paymentMethod,
      totalAmount,
      total: formattedTotal
    };

    try {
      // 1. Save to backend database & trigger server-side Telegram alert (server handles deduplication)
      const apiResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (!apiResponse.ok) {
        throw new Error('Server returned error');
      }

      const resData = await apiResponse.json();

      // If server did not send Telegram alert for some reason, trigger client fallback
      if (!resData.telegramSent) {
        await sendTelegramOrderNotification({
          name,
          phone,
          food,
          address,
          locationLink: finalLocationLink,
          orderCode: generatedCode,
          orderType: 'Delivery',
          paymentMethod,
          total: formattedTotal,
          notes
        });
      }

      setStatus('success');
      setStatusMessage('Waad mahadsan tahay! Dalabkaaga si guul leh ayaa loo diray oo loogu helay Telegram-ka.');
      setLastOrderInfo({ name, food, code: generatedCode, locationLink: finalLocationLink });
      setFormData({ name: '', phone: '', food: '', address: '', notes: '', paymentMethod: 'EVC Plus (712)' });
      setLocationState({ locationLink: '', coords: null, addressText: '' });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.warn('Backend order request failed, attempting direct Telegram fallback:', error);
      // Fallback: Send directly to Telegram bot
      try {
        await sendTelegramOrderNotification({
          name,
          phone,
          food,
          address,
          locationLink: finalLocationLink,
          orderCode: generatedCode,
          orderType: 'Delivery',
          paymentMethod,
          total: formattedTotal,
          notes
        });
      } catch (fallbackErr) {
        console.warn('Fallback telegram alert skipped:', fallbackErr);
      }

      setStatus('success');
      setStatusMessage('Dalabkaaga waa la duubay! Kooxda Baraa Restaurant ayaa kula soo xiriiri doonta.');
      setLastOrderInfo({ name, food, code: generatedCode, locationLink: finalLocationLink });
      setFormData({ name: '', phone: '', food: '', address: '', notes: '', paymentMethod: 'EVC Plus (712)' });
      setLocationState({ locationLink: '', coords: null, addressText: '' });
      if (onSuccess) onSuccess();
    }
  };

  return (
    <div id="quick-order-form-container" className={`bg-white rounded-xl shadow-xl border border-gold-500/20 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-950 via-primary-900 to-primary-950 p-5 sm:p-6 text-white border-b border-gold-500/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gold-500/20 border border-gold-400 flex items-center justify-center text-gold-400">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-heading font-bold text-white flex items-center gap-2">
              Dalab Cunto & Location
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-gold-500/20 text-gold-300 border border-gold-500/40">
                <Sparkles className="w-3 h-3 mr-1" /> Telegram Alert
              </span>
            </h3>
            <p className="text-xs text-gray-300">
              Cuntada aad doorato waxaa toos loogu soo dirayaa Telegram oo uu la socdo Location link!
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
        {/* Name input */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5" htmlFor="order-form-name">
            <User className="w-3.5 h-3.5 text-gold-600" />
            Magacaaga (Name) *
          </label>
          <input
            id="order-form-name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Tusaale: Cali Maxamed"
            required
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Phone input */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5" htmlFor="order-form-phone">
            <Phone className="w-3.5 h-3.5 text-gold-600" />
            Nambarka Mobaylka (Phone) *
          </label>
          <input
            id="order-form-phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Tusaale: 771234567 ama 061XXXXXXX"
            required
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Food item input */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5" htmlFor="order-form-food">
            <Utensils className="w-3.5 h-3.5 text-gold-600" />
            Cuntada aad doonayso (Food Item) *
          </label>
          <div className="space-y-2">
            <input
              id="order-form-food"
              type="text"
              name="food"
              value={formData.food}
              onChange={handleChange}
              placeholder="Tusaale: Sambuusa ($0.50), Pizza Deluxe, Shawaarmo..."
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
            />
            {/* Quick selector chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {MENU_ITEMS.slice(0, 5).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, food: `${item.name} ($${item.price.toFixed(2)})` })}
                  className={`text-[11px] px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                    formData.food.includes(item.name)
                      ? 'bg-gold-500 text-primary-950 border-gold-600 font-bold'
                      : 'bg-gray-100 text-gray-700 border-gray-200 hover:border-gold-400'
                  }`}
                >
                  + {item.name} (${item.price.toFixed(2)})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* LOCATION SECTION (GPS & Link) */}
        <div className="pt-1">
          <LocationPicker
            locationLink={locationState.locationLink}
            coords={locationState.coords}
            addressText={locationState.addressText}
            onChange={(val) => {
              setLocationState(val);
              setFormData({ ...formData, address: val.addressText });
            }}
            required={true}
          />
        </div>

        {/* Payment and Fariin Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Payment Method */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5" htmlFor="order-form-payment">
              <CreditCard className="w-3.5 h-3.5 text-gold-600" />
              Lacag Bixinta *
            </label>
            <select
              id="order-form-payment"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all"
            >
              <option value="EVC Plus (712)">EVC Plus (712)</option>
              <option value="EVC Plus">EVC Plus</option>
              <option value="Premier Wallet">Premier Wallet</option>
              <option value="Zaad">Zaad Service</option>
              <option value="Sahal">Sahal Service</option>
              <option value="Cash on Delivery">Kaash marka laguu keeno</option>
            </select>
          </div>

          {/* Fariin / Customer Notes */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5" htmlFor="order-form-notes">
              <MessageSquare className="w-3.5 h-3.5 text-gold-600" />
              Fariin / Codsi Gaar ah
            </label>
            <input
              id="order-form-notes"
              type="text"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Tusaale: Dalab degdeg ah fadlan, qolka 5..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all"
            />
          </div>
        </div>

        {/* Status notification box if triggered */}
        {status === 'success' && lastOrderInfo && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl space-y-3">
            <div className="flex items-start gap-2.5 text-emerald-900">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm">Dalabkaaga Waa La Helay!</h4>
                <p className="text-xs text-emerald-800 mt-0.5">{statusMessage}</p>
              </div>
            </div>
            
            <div className="bg-white/80 p-3 rounded-lg border border-emerald-200 text-xs text-slate-700 space-y-1.5">
              <p><strong>Code-ka Dalabka:</strong> <span className="font-mono text-gold-700 font-bold">{lastOrderInfo.code}</span></p>
              <p><strong>Macmiilka:</strong> {lastOrderInfo.name}</p>
              <p><strong>Cuntada:</strong> {lastOrderInfo.food}</p>
              {lastOrderInfo.locationLink && (
                <p className="flex items-center gap-1.5">
                  <strong>Location Link:</strong>
                  <a
                    href={lastOrderInfo.locationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold-700 hover:text-gold-800 underline font-mono text-[11px] truncate inline-flex items-center gap-1"
                  >
                    <span>Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <a
                href={`https://wa.me/252771909054?text=Asc%20Baraa%20Restaurant,%20waxaan%20dalbaday%20cunto%20code:%20${lastOrderInfo.code}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all"
              >
                WhatsApp Ku Xaqiiji
              </a>
              <button
                type="button"
                onClick={() => {
                  setStatus('idle');
                  setLastOrderInfo(null);
                }}
                className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-all cursor-pointer"
              >
                Dalbo Mid Kale
              </button>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-rose-800 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Submit button */}
        <button
          id="order-form-submit-button"
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-primary-950 font-bold text-sm py-3 px-4 rounded-lg shadow-lg shadow-gold-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Fariinta iyo Location-ka ayaa la dirayaa...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Dalbo Hadda (Dir Telegram)</span>
            </>
          )}
        </button>

        <p className="text-[11px] text-gray-400 text-center flex items-center justify-center gap-1">
          <span>🔒 Dalabkaaga iyo Location Link-ga toos ayay ugu dhacayaan Telegram-ka Maqaayadda.</span>
        </p>
      </form>
    </div>
  );
}

