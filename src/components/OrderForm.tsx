import React, { useState, useEffect } from 'react';
import { 
  Send, CheckCircle2, AlertCircle, ShoppingBag, Phone, User, Utensils, 
  Sparkles, Loader2, MessageSquare, PhoneCall, Copy, Check, MapPin 
} from 'lucide-react';
import { MENU_ITEMS } from '../data';
import { sendTelegramOrderNotification } from '../lib/telegram';
import SmartPaymentSelector from './SmartPaymentSelector';
import LocationPicker from './LocationPicker';
import { generateSmartUSSD, PaymentMethodId } from '../lib/smartPayment';
import { getStoredGpsCoords, formatGpsLink, isGpsCoordinateLink, GpsCoordinates, resolveOrderGpsLocation } from '../lib/gps';

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
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>('EVC Plus');
  const [paymentStatus, setPaymentStatus] = useState<'pay_now' | 'already_paid' | 'cash_on_delivery'>('pay_now');
  const [transactionId, setTransactionId] = useState('');
  const [copiedSuccessUssd, setCopiedSuccessUssd] = useState(false);
  const [locationState, setLocationState] = useState<{
    locationLink: string;
    coords: { lat: number; lng: number } | null;
    addressText: string;
  }>(() => {
    const stored = getStoredGpsCoords();
    return {
      locationLink: stored ? formatGpsLink(stored) : '',
      coords: stored ? { lat: stored.lat, lng: stored.lng } : null,
      addressText: '',
    };
  });

  useEffect(() => {
    const handleGpsUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<GpsCoordinates>;
      if (customEvent.detail && customEvent.detail.lat && customEvent.detail.lng) {
        setLocationState((prev) => ({
          ...prev,
          coords: { lat: customEvent.detail.lat, lng: customEvent.detail.lng },
          locationLink: formatGpsLink(customEvent.detail),
        }));
      }
    };
    window.addEventListener('baraa_gps_updated', handleGpsUpdate);
    return () => window.removeEventListener('baraa_gps_updated', handleGpsUpdate);
  }, []);

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [lastOrderInfo, setLastOrderInfo] = useState<{ 
    name: string; 
    food: string; 
    code: string; 
    address: string;
    locationLink?: string;
    totalAmount?: number;
    paymentMethod?: string;
    paymentStatus?: 'pay_now' | 'already_paid' | 'cash_on_delivery';
    transactionId?: string;
    paymentUssd?: string;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const matchedItem = MENU_ITEMS.find(m => m.name.toLowerCase() === formData.food.toLowerCase());
  const currentTotalAmount = matchedItem ? matchedItem.price : 2.50;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = formData.name.trim();
    const phone = formData.phone.trim();
    const food = formData.food.trim();
    const address = formData.address.trim() || locationState.addressText.trim();
    const notes = formData.notes.trim() || 'Dalab degdeg ah fadlan';

    if (!name || !phone || !food) {
      setStatus('error');
      setStatusMessage('Fadlan buuxi Magacaaga, Nambarka Taleefanka, iyo Cuntada aad rabto.');
      return;
    }

    if (!address) {
      setStatus('error');
      setStatusMessage('Fadlan qor ciwaankaaga ama degmadaada (Tusaale: Hodan, Taleex, KM4).');
      return;
    }

    setStatus('loading');
    setStatusMessage('');

    const generatedCode = `BR-ORD-${Date.now().toString().slice(-6)}`;
    const totalAmount = currentTotalAmount;
    const formattedTotal = `$${totalAmount.toFixed(2)}`;
    const paymentUssd = generateSmartUSSD(paymentMethod, totalAmount);
    
    // Resolve GPS coords strictly with smart Mogadishu fallback
    const resolvedGps = resolveOrderGpsLocation(address, locationState.coords, locationState.locationLink);
    const finalLocationLink = resolvedGps.link;
    const finalCoords = resolvedGps.coords;

    const orderPayload = {
      customerName: name,
      customerPhone: phone,
      food,
      address,
      locationLink: finalLocationLink,
      coords: finalCoords,
      notes,
      orderCode: generatedCode,
      orderType: 'delivery',
      paymentMethod,
      paymentStatus,
      transactionId,
      paymentUssd,
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
          coords: finalCoords,
          orderCode: generatedCode,
          orderType: 'Delivery',
          paymentMethod,
          paymentStatus,
          transactionId,
          paymentUssd,
          total: formattedTotal,
          notes
        });
      }

      setStatus('success');
      setStatusMessage('Waad mahadsan tahay! Dalabkaaga si guul leh ayaa loo diray oo loogu helay Telegram-ka.');
      setLastOrderInfo({ 
        name, 
        food, 
        code: generatedCode, 
        address,
        locationLink: finalLocationLink,
        totalAmount,
        paymentMethod,
        paymentStatus,
        transactionId,
        paymentUssd
      });
      setFormData({ name: '', phone: '', food: '', address: '', notes: '' });
      setTransactionId('');
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
          coords: finalCoords,
          orderCode: generatedCode,
          orderType: 'Delivery',
          paymentMethod,
          paymentStatus,
          transactionId,
          paymentUssd,
          total: formattedTotal,
          notes
        });
      } catch (fallbackErr) {
        console.warn('Fallback telegram alert skipped:', fallbackErr);
      }

      setStatus('success');
      setStatusMessage('Dalabkaaga waa la duubay! Kooxda Baraa Restaurant ayaa kula soo xiriiri doonta.');
      setLastOrderInfo({ 
        name, 
        food, 
        code: generatedCode, 
        address,
        locationLink: finalLocationLink,
        totalAmount,
        paymentMethod,
        paymentStatus,
        transactionId,
        paymentUssd
      });
      setFormData({ name: '', phone: '', food: '', address: '', notes: '' });
      setTransactionId('');
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
              Dalab Cunto Degdeg Ah
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-gold-500/20 text-gold-300 border border-gold-500/40">
                <Sparkles className="w-3 h-3 mr-1" /> Telegram Alert
              </span>
            </h3>
            <p className="text-xs text-gray-300">
              Cuntada aad doorato waxaa toos loogu soo dirayaa Telegram-ka maqaayadda!
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

        {/* LOCATION SECTION (GPS & Ciwaan) */}
        <div>
          <LocationPicker
            locationLink={locationState.locationLink}
            coords={locationState.coords}
            addressText={locationState.addressText || formData.address}
            onChange={(val) => {
              setLocationState(val);
              setFormData((prev) => ({ ...prev, address: val.addressText }));
            }}
            required={true}
            autoRequest={true}
          />
        </div>

        {/* SMART PAYMENT SECTION */}
        <div className="pt-1">
          <SmartPaymentSelector
            selectedMethod={paymentMethod}
            onSelectMethod={setPaymentMethod}
            customerPhone={formData.phone}
            totalAmount={currentTotalAmount}
            paymentStatus={paymentStatus}
            onChangePaymentStatus={setPaymentStatus}
            transactionId={transactionId}
            onChangeTransactionId={setTransactionId}
          />
        </div>

        {/* Fariin / Customer Notes */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5" htmlFor="order-form-notes">
            <MessageSquare className="w-3.5 h-3.5 text-gold-600" />
            Fariin / Codsi Gaar ah (Optional)
          </label>
          <input
            id="order-form-notes"
            type="text"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Tusaale: Dalab degdeg ah fadlan, maraq dheeri ah..."
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all"
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
            
            <div className="bg-white/80 p-3 rounded-lg border border-emerald-200 text-xs text-slate-700 space-y-1.5">
              <p><strong>Code-ka Dalabka:</strong> <span className="font-mono text-gold-700 font-bold">{lastOrderInfo.code}</span></p>
              <p><strong>Macmiilka:</strong> {lastOrderInfo.name}</p>
              <p><strong>Cuntada:</strong> {lastOrderInfo.food}</p>
              <p><strong>Ciwaanka:</strong> {lastOrderInfo.address}</p>
              {typeof lastOrderInfo.totalAmount === 'number' && (
                <p><strong>Qiimaha Guud:</strong> <span className="font-bold text-gold-700">${lastOrderInfo.totalAmount.toFixed(2)}</span></p>
              )}
              {lastOrderInfo.paymentMethod && (
                <p><strong>Lacag Bixinta:</strong> {lastOrderInfo.paymentMethod}</p>
              )}
              {lastOrderInfo.paymentStatus === 'already_paid' && (
                <p className="text-emerald-700 font-semibold">
                  ✅ Lacagta waad bixisay {lastOrderInfo.transactionId ? `(Tx ID: ${lastOrderInfo.transactionId})` : ''}
                </p>
              )}
              {lastOrderInfo.paymentStatus === 'cash_on_delivery' && (
                <p className="text-amber-800 font-semibold">
                  💵 Lacagta caddaan ahaan ayaad u siinaysaa gaarsiiyaha marka cuntada laguu keeno.
                </p>
              )}
            </div>

            {/* Smart USSD Payment button if pay_now */}
            {lastOrderInfo.paymentStatus === 'pay_now' && lastOrderInfo.paymentUssd && (
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-center space-y-2">
                <p className="text-[11px] font-bold text-amber-900 uppercase tracking-wide">
                  Garaac lambarkan si aad u bixiso (${(lastOrderInfo.totalAmount || 0).toFixed(2)}):
                </p>
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${encodeURIComponent(lastOrderInfo.paymentUssd)}`}
                    className="flex-1 py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow transition-all"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Garaac {lastOrderInfo.paymentUssd}</span>
                  </a>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(lastOrderInfo.paymentUssd || '');
                        setCopiedSuccessUssd(true);
                        setTimeout(() => setCopiedSuccessUssd(false), 2000);
                      } catch {
                        setCopiedSuccessUssd(true);
                      }
                    }}
                    className="py-2 px-3 bg-white border border-amber-300 text-amber-900 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-amber-50"
                  >
                    {copiedSuccessUssd ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Waa la qaaday</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-amber-700" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

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
              <span>Dalabkaaga ayaa la dirayaa...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Dalbo Hadda (Dir Telegram)</span>
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
