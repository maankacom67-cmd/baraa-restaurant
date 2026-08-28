import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, CheckCircle2, AlertCircle, ShoppingBag, MapPin, Phone, User, Utensils, Sparkles, Loader2 } from 'lucide-react';
import { MENU_ITEMS } from '../data';
import { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } from '../lib/telegram';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim() || !formData.food.trim() || !formData.address.trim()) {
      alert('Fadlan buuxi dhammaan macluumaadka foomka.');
      return;
    }

    setStatus('loading');

    const botToken = TELEGRAM_BOT_TOKEN;
    const chatId = TELEGRAM_CHAT_ID;

    const text = `🍕 *DALAB CUNTO CUSUB!*%0A%0A` +
                 `👤 *Magaca:* ${encodeURIComponent(formData.name)}%0A` +
                 `📞 *Nambarka:* ${encodeURIComponent(formData.phone)}%0A` +
                 `🍔 *Cuntada:* ${encodeURIComponent(formData.food)}%0A` +
                 `📍 *Ciwaanka:* ${encodeURIComponent(formData.address)}`;

    const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${text}&parse_mode=Markdown`;

    try {
      const response = await fetch(url);
      if (response.ok) {
        setStatus('success');
        setStatusMessage('Waad mahadsan tahay! Dalabkaaga waa la helay.');
        alert('Waad mahadsan tahay! Dalabkaaga waa la helay.');
        setFormData({ name: '', phone: '', food: '', address: '' });
        if (onSuccess) onSuccess();
      } else {
        setStatus('error');
        setStatusMessage('Dhib ayaa dhacay, fadlan dib u isku day.');
        alert('Dhib ayaa dhacay, fadlan dib u isku day.');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
      setStatusMessage("Khadka intanet-ka ayaa go'an.");
      alert("Khadka intanet-ka ayaa go'an.");
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
        {status === 'success' && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-emerald-800 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statusMessage}</span>
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
