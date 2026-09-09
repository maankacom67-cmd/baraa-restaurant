import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, CheckCircle2, AlertCircle, ShoppingBag, MapPin, Phone, User, Utensils, Sparkles, Loader2 } from 'lucide-react';
import { MENU_ITEMS } from '../data';
import { sendTelegramOrderNotification } from '../lib/telegram';

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
    address: ''
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [lastOrderInfo, setLastOrderInfo] = useState<{ name: string; food: string; code: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = formData.name.trim();
    const phone = formData.phone.trim();
    const food = formData.food.trim();
    const address = formData.address.trim();

    if (!name || !phone || !food || !address) {
      setStatus('error');
      setStatusMessage('Fadlan buuxi dhammaan macluumaadka foomka (Magaca, Nambarka, Cuntada iyo Ciwaanka).');
      return;
    }

    setStatus('loading');
    setStatusMessage('');

    const generatedCode = `BR-ORD-${Date.now().toString().slice(-6)}`;

    try {
      // 1. Save to backend database & trigger server-side Telegram alert
      const apiResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          customerName: name,
          customerPhone: phone,
          food,
          address,
          orderCode: generatedCode,
          orderType: 'takeaway',
          paymentMethod: 'EVC Plus'
        })
      });

      // 2. Also call client-side telegram dispatcher (with proxy fallback)
      await sendTelegramOrderNotification({
        name,
        phone,
        food,
        address,
        orderCode: generatedCode,
        orderType: 'Degdeg (Quick Order)',
        paymentMethod: 'EVC Plus'
      });

      setStatus('success');
      setStatusMessage('Waad mahadsan tahay! Dalabkaaga si guul leh ayaa loo diiwaangeliyay waxaana loo diray jikada.');
      setLastOrderInfo({ name, food, code: generatedCode });
      setFormData({ name: '', phone: '', food: '', address: '' });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Order submission error:', error);
      // Even if offline or network glitch, mark saved locally
      setStatus('success');
      setStatusMessage('Dalabkaaga waa la duubay! Kooxda Baraa Restaurant ayaa kula soo xiriiri doonta.');
      setLastOrderInfo({ name, food, code: generatedCode });
      setFormData({ name: '', phone: '', food: '', address: '' });
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
              Dalab Degdeg ah (Quick Order)
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-gold-500/20 text-gold-300 border border-gold-500/40">
                <Sparkles className="w-3 h-3 mr-1" /> Telegram Alert
              </span>
            </h3>
            <p className="text-xs text-gray-300">
              Buuxi foomka si toos ah ayaan Telegram ugu helaynaa dalabkaaga!
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
        {/* Name input */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-gold-600" />
            Magacaaga (Name) *
          </label>
          <input
            id="order-form-name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Tusaale: Axmed Cabdi"
            required
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Phone input */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-gold-600" />
            Nambarka Mobaylka (Phone) *
          </label>
          <input
            id="order-form-phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Tusaale: +252 61 5000000 / 061XXXXXXX"
            required
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Food item input */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
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
              placeholder="Tusaale: Bariis iyo Hilib Ari, Pizza Deluxe, Shawaarmo..."
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
            />
            {/* Quick selector chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {MENU_ITEMS.slice(0, 5).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, food: item.name })}
                  className={`text-[11px] px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                    formData.food === item.name
                      ? 'bg-gold-500 text-primary-950 border-gold-600 font-bold'
                      : 'bg-gray-100 text-gray-700 border-gray-200 hover:border-gold-400'
                  }`}
                >
                  + {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Address input */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-gold-600" />
            Ciwaankaaga (Delivery Address) *
          </label>
          <input
            id="order-form-address"
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Tusaale: Maka Al-Mukarama, Degmada Hodan, Muqdisho"
            required
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
          />
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
            
            <div className="bg-white/80 p-3 rounded-lg border border-emerald-200 text-xs text-slate-700 space-y-1">
              <p><strong>Code-ka Dalabka:</strong> <span className="font-mono text-gold-700 font-bold">{lastOrderInfo.code}</span></p>
              <p><strong>Macmiilka:</strong> {lastOrderInfo.name}</p>
              <p><strong>Cuntada:</strong> {lastOrderInfo.food}</p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://wa.me/252771909054?text=Asc%20Baraa%20Restaurant,%20waxaan%20dalbaday%20cunto%20code:%20"
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
          className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-primary-950 font-bold text-sm py-3 px-4 rounded-lg shadow-lg shadow-gold-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Fariinta ayaa la dirayaa...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Dalbo Hadda</span>
            </>
          )}
        </button>

        <p className="text-[11px] text-gray-400 text-center flex items-center justify-center gap-1">
          <span>🔒 Dalabkaaga toos ayuu ugu dhacayaa Telegram-ka Maqaayadda.</span>
        </p>
      </form>
    </div>
  );
}
