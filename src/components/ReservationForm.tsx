import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Users, Clock, CreditCard, Ticket, CheckCircle2, ChevronRight, Phone, Trash2, HelpCircle, Mail, Settings, AlertCircle, ExternalLink, Check, X } from 'lucide-react';
import { Booking } from '../types';
import emailjs from '@emailjs/browser';

export default function ReservationForm() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [name, setName] = useState('');
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [requests, setRequests] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'evc_plus' | 'premier_wallet' | 'salaam_bank'>('evc_plus');
  const [paymentNumber, setPaymentNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'success' | 'error' | 'not_configured'>('idle');
  const [showConfigHelper, setShowConfigHelper] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isConfirmingDeleteAll, setIsConfirmingDeleteAll] = useState(false);


  // Load existing bookings from server API or fallback to localStorage on mount
  useEffect(() => {
    async function fetchBookings() {
      try {
        const response = await fetch('/api/bookings');
        if (response.ok) {
          const data = await response.json();
          setBookings(data);
          localStorage.setItem('baraa_bookings', JSON.stringify(data));
        } else {
          throw new Error('API response not ok');
        }
      } catch (e) {
        console.warn('Failed to load bookings from backend API, falling back to localStorage', e);
        try {
          const stored = localStorage.getItem('baraa_bookings');
          if (stored) {
            setBookings(JSON.parse(stored));
          }
        } catch (localErr) {
          console.error('Failed to load local storage bookings', localErr);
        }
      }
    }
    fetchBookings();
  }, []);

  // Set default date to today or tomorrow
  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setDate(`${yyyy}-${mm}-${dd}`);
    setTime('18:30');
  }, []);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !date || !time || !paymentNumber) {
      alert('Fadlan buuxi dhammaan macluumaadka loo baahan yahay.');
      return;
    }

    setIsSubmitting(true);
    setEmailStatus('idle');

    // Generate Booking Details
    const codeSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const bookingCode = `BR-2026-${codeSuffix}`;
    
    const newBooking: Booking = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      guests,
      date,
      time,
      requests,
      paymentMethod,
      paymentNumber,
      isConfirmed: true,
      bookingCode,
      createdAt: new Date().toLocaleDateString('so-SO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    // EmailJS credentials hardcoded
    const serviceId = "service_9ufa6x1";
    const templateId = "template_mo42cxc";
    const publicKey = "user_fElg0MmaVdQdzy1yR";

    if (serviceId && templateId && publicKey) {
      try {
        const templateParams = {
          customer_name: name,
          phone_number: paymentNumber,
          location: 'Baraa Restaurant Table Reservation',
          order_details: `Table reservation for ${guests} guests on ${date} at ${time}. Code: ${bookingCode}`,
          total_price: '$0.00',

          to_name: 'Baraa Restaurant Admin',
          guests_count: guests,
          booking_date: date,
          booking_time: time,
          special_requests: requests || 'Ma jiraan codsiyo gaar ah',
          payment_method: paymentMethod.replace('_', ' ').toUpperCase(),
          payment_number: paymentNumber,
          booking_code: bookingCode,
          created_at: newBooking.createdAt,
          admin_email: 'maankacom66@gmail.com'
        };

        console.log("Sending Reservation EmailJS with params:", templateParams);
        emailjs.init({ publicKey });
        const res = await emailjs.send(serviceId, templateId, templateParams, { publicKey });
        console.log("Reservation EmailJS Result:", res);
        setEmailStatus('success');
      } catch (error) {
        console.error('EmailJS Send Error Details:', error);
        setEmailStatus('error');
      }
    } else {
      console.warn('EmailJS components are not configured yet.');
      setEmailStatus('not_configured');
    }

    // Save locally and send to server API database
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          guests,
          date,
          time,
          requests,
          paymentMethod,
          paymentNumber,
          bookingCode,
        }),
      });

      if (response.ok) {
        const savedBooking = await response.json();
        const updated = [savedBooking, ...bookings];
        setBookings(updated);
        localStorage.setItem('baraa_bookings', JSON.stringify(updated));
        setCurrentBooking(savedBooking);
      } else {
        throw new Error('Server API failed');
      }
    } catch (apiErr) {
      console.warn('Could not post to backend API, saving locally only', apiErr);
      const updated = [newBooking, ...bookings];
      setBookings(updated);
      localStorage.setItem('baraa_bookings', JSON.stringify(updated));
      setCurrentBooking(newBooking);
    }

    setIsSubmitting(false);

    // Reset Form fields
    setName('');
    setRequests('');
    setPaymentNumber('');
  };

  const deleteBooking = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(id);
  };

  const confirmDeleteBooking = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Could not delete from backend API', err);
    }
    const updated = bookings.filter((b) => b.id !== id);
    setBookings(updated);
    localStorage.setItem('baraa_bookings', JSON.stringify(updated));
    if (currentBooking?.id === id) {
      setCurrentBooking(null);
    }
    setDeletingId(null);
  };

  const cancelDeleteBooking = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(null);
  };

  return (
    <section className="py-20 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Banner Section */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-gold-600 font-sans font-bold text-xs tracking-[0.25em] uppercase block mb-3">
            KU SOO DHAWAW BARAA
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-900 mb-4">
            Ballanso Miis maanta
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Si aad u hubiso miis qurux badan oo diyaar ah, fadlan buuxi foomka hoose oo dooro qaabka aad ku bixinayso deeqda yar ee boos-celinta si toos ah.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Reservation Form Column */}
          <div className="lg:col-span-7 bg-white rounded-lg p-8 border border-gray-200/80 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none text-slate-800">
              <Calendar className="w-48 h-48" />
            </div>

            <div className="mb-8 border-l-4 border-gold-500 pl-4">
              <h3 className="text-xl font-heading font-bold text-primary-900">
                Foomka Ballansashada
              </h3>
              <p className="text-xs text-gray-500 tracking-wider font-sans uppercase">
                fadlan gali macluumaadkaaga rasmiga ah
              </p>
            </div>

            {/* EmailJS Integration Block */}
            {(() => {
              const serviceId = "service_9ufa6x1";
              const templateId = "template_mo42cxc";
              const publicKey = "user_fElg0MmaVdQdzy1yR";
              const isConfigured = !!(serviceId && templateId && publicKey);

              return (
                <div className="mb-6 p-4 rounded bg-slate-50 border border-slate-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className={`w-2.5 h-2.5 rounded-full mt-1 ${isConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 font-sans">
                          <span>Xiriirka EmailJS</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${isConfigured ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                            {isConfigured ? 'WAA KUXIRAN YAHAY' : 'DEMO MODE'}
                          </span>
                        </h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {isConfigured 
                            ? 'Ogeysiisyada dalabaadka miisaska si toos ah ayey email-kaaga ugu dhacayaan.'
                            : 'Macaamiishu markay kursi qabsadaan si email lagugu soo diro, u xir EmailJS.'}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowConfigHelper(!showConfigHelper)}
                      className="text-xs text-gold-600 hover:text-gold-700 font-medium hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-center shrink-0"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      <span>{showConfigHelper ? 'Qari' : 'Habaynta'}</span>
                    </button>
                  </div>

                  {/* Expandable Configuration Helper */}
                  {showConfigHelper && (
                    <div className="mt-4 pt-4 border-t border-slate-200 space-y-3.5 text-xs text-slate-700 leading-relaxed">
                      <div className="bg-amber-50/50 p-3 rounded border border-amber-100 flex gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <p className="text-[11px] text-amber-900">
                          Si aad u xirto sanduuqaaga fariimaha rasmiga ah, fadlan iska diiwaangeli <a href="https://www.emailjs.com" target="_blank" rel="noopener noreferrer" className="underline font-bold text-amber-950 inline-flex items-center gap-0.5">emailjs.com <ExternalLink className="w-2.5 h-2.5 inline" /></a> oo deji dooriyayaasha deegaanka ee hoose.
                        </p>
                      </div>

                      <div className="space-y-2.5">
                        <p className="font-bold text-slate-800">Tallaabooyinka Habaynta:</p>
                        <ol className="list-decimal list-inside space-y-1.5 text-[11px] pl-1">
                          <li>Samee xisaab EmailJS ah, ka dibna ku dar <strong>Email Service</strong> (e.g. Gmail).</li>
                          <li>Samee <strong>Email Template</strong> oo u bixi dooriyayaashan: 
                            <code className="block mt-1 bg-slate-100 p-1.5 rounded text-[10px] font-mono text-slate-800 leading-normal whitespace-pre-wrap">
                              {"{"}{"{"}customer_name{"}"}{"}"} - Magaca macaamilka{"\n"}
                              {"{"}{"{"}guests_count{"}"}{"}"} - Tirada dadka{"\n"}
                              {"{"}{"{"}booking_date{"}"}{"}"} - Taariikhda ballanta{"\n"}
                              {"{"}{"{"}booking_time{"}"}{"}"} - Waqtiga ballanta{"\n"}
                              {"{"}{"{"}special_requests{"}"}{"}"} - Codsiga gaarka ah{"\n"}
                              {"{"}{"{"}booking_code{"}"}{"}"} - Lambarka tigidhka{"\n"}
                              {"{"}{"{"}payment_method{"}"}{"}"} - Qaabka lacag bixinta{"\n"}
                              {"{"}{"{"}payment_number{"}"}{"}"} - Lambarka lacagta laga bixiyay
                            </code>
                          </li>
                          <li>Ku dar furayaashan qaybta <strong>Secrets Panel</strong> ee AI Studio (Settings) ama faylka <code className="font-mono text-gold-700">.env</code>:</li>
                        </ol>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-[10px] font-mono bg-slate-100 p-3 rounded border border-slate-200">
                          <div className="overflow-hidden">
                            <span className="text-slate-500 block text-[9px] uppercase">Service ID Key</span>
                            <span className="font-bold text-slate-800 break-all">{serviceId || 'Ma jiro (Empty)'}</span>
                          </div>
                          <div className="overflow-hidden">
                            <span className="text-slate-500 block text-[9px] uppercase">Template ID Key</span>
                            <span className="font-bold text-slate-800 break-all">{templateId || 'Ma jiro (Empty)'}</span>
                          </div>
                          <div className="overflow-hidden">
                            <span className="text-slate-500 block text-[9px] uppercase">Public Key</span>
                            <span className="font-bold text-slate-800 break-all">{publicKey || 'Ma jiro (Empty)'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            <form onSubmit={handleBookingSubmit} className="space-y-6">
              
              {/* Name field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-sans font-bold text-gray-600 uppercase" htmlFor="name">
                  Magacaaga oo Dhamaystiran *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ahmed Cali Geedi"
                    className="w-full bg-slate-50 text-slate-900 text-sm py-3 px-4 rounded border border-gray-200 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                  />
                </div>
              </div>

              {/* Grid with Guests, Date, Time */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Number of guests */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-sans font-bold text-gray-600 uppercase" htmlFor="guests">
                    Tirada Dadka
                  </label>
                  <div className="relative">
                    <select
                      id="guests"
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full bg-slate-50 text-slate-900 text-sm py-3 px-3 rounded border border-gray-200 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors appearance-none cursor-pointer"
                    >
                      {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'Qof' : 'Qofood'}
                        </option>
                      ))}
                    </select>
                    <Users className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Date */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-sans font-bold text-gray-600 uppercase" htmlFor="date">
                    Taariikhda
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 text-sm py-3 px-3 rounded border border-gray-200 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Time */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-sans font-bold text-gray-600 uppercase" htmlFor="time">
                    Waqtiga
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      id="time"
                      required
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 text-sm py-3 px-3 rounded border border-gray-200 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                    />
                  </div>
                </div>

              </div>

              {/* Special requests */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-sans font-bold text-gray-600 uppercase" htmlFor="requests">
                  Codsiyada Gaarka ah (Ikhtiyaari)
                </label>
                <textarea
                  id="requests"
                  rows={2}
                  value={requests}
                  onChange={(e) => setRequests(e.target.value)}
                  placeholder="Tusaale: Meel dariishadda agteeda ah, Maalinta dhalashada, xasaasiyad cunto, iwm."
                  className="w-full bg-slate-50 text-slate-900 text-sm py-3 px-4 rounded border border-gray-200 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors resize-none"
                />
              </div>

              {/* Localized Payment Methods Selector */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <label className="block text-xs font-sans font-bold text-gray-600 uppercase">
                  Qaabka Lacag Bixinta (Boos celin - $2.00)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* EVC Plus */}
                  <label
                    onClick={() => setPaymentMethod('evc_plus')}
                    className={`relative p-4 rounded border cursor-pointer flex flex-col gap-1.5 transition-all select-none ${
                      paymentMethod === 'evc_plus'
                        ? 'bg-amber-50/50 border-gold-500 text-amber-900'
                        : 'bg-white border-gray-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <CreditCard className="w-4 h-4 text-gold-500" />
                      <span>EVC Plus</span>
                    </div>
                    <span className="text-[10px] text-gray-500">Hormuud Telecom</span>
                  </label>

                  {/* Premier Wallet */}
                  <label
                    onClick={() => setPaymentMethod('premier_wallet')}
                    className={`relative p-4 rounded border cursor-pointer flex flex-col gap-1.5 transition-all select-none ${
                      paymentMethod === 'premier_wallet'
                        ? 'bg-amber-50/50 border-gold-500 text-amber-900'
                        : 'bg-white border-gray-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <CreditCard className="w-4 h-4 text-gold-500" />
                      <span>Premier Wallet</span>
                    </div>
                    <span className="text-[10px] text-gray-500">Premier Bank</span>
                  </label>

                  {/* Salaam Bank */}
                  <label
                    onClick={() => setPaymentMethod('salaam_bank')}
                    className={`relative p-4 rounded border cursor-pointer flex flex-col gap-1.5 transition-all select-none ${
                      paymentMethod === 'salaam_bank'
                        ? 'bg-amber-50/50 border-gold-500 text-amber-900'
                        : 'bg-white border-gray-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <CreditCard className="w-4 h-4 text-gold-500" />
                      <span>Salaam Bank</span>
                    </div>
                    <span className="text-[10px] text-gray-500">Salaam Somali Bank</span>
                  </label>
                </div>
              </div>

              {/* Payment details number input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-sans font-bold text-gray-600 uppercase" htmlFor="paymentNumber">
                  {paymentMethod === 'evc_plus' && 'Gali Lambarka EVC Plus (Tus. 61xxxxxxx) *'}
                  {paymentMethod === 'premier_wallet' && 'Gali Lambarka Akoonka Premier Wallet *'}
                  {paymentMethod === 'salaam_bank' && 'Gali Lambarka Akoonka Salaam Bank *'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="paymentNumber"
                    required
                    value={paymentNumber}
                    onChange={(e) => setPaymentNumber(e.target.value)}
                    placeholder={
                      paymentMethod === 'evc_plus' ? '061XXXXXXX' : 'Account ID / Wallet ID'
                    }
                    className="w-full bg-slate-50 text-slate-900 text-sm py-3 px-10 rounded border border-gray-200 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                  />
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full font-sans font-bold text-xs tracking-widest py-4 rounded-sm hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isSubmitting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-primary-900 text-gold-400 hover:bg-primary-950'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-gold-400" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>FARIINTAADA WAA LA DIRAYAA...</span>
                  </>
                ) : (
                  <>
                    <Ticket className="w-4 h-4" />
                    <span>BUUG-GARAAYSO MIISKAADA</span>
                  </>
                )}
              </button>

            </form>
          </div>

          {/* Ticket View & Past Bookings Column */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Real-time Generated Receipt/Ticket */}
            <AnimatePresence mode="wait">
              {currentBooking ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-lg border-2 border-dashed border-gray-300 shadow-xl overflow-hidden relative"
                >
                  {/* Decorative green badge */}
                  <div className="bg-emerald-500 text-white py-3 px-6 text-center text-xs font-sans font-bold tracking-widest flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    BALLAN-CEELINTA WAA LA XAQIIJIYAY!
                  </div>

                  {/* EmailJS Send Status Alert */}
                  {emailStatus === 'success' && (
                    <div className="bg-blue-600 text-white py-2.5 px-6 text-center text-[10px] font-sans font-bold tracking-wider uppercase flex items-center justify-center gap-2">
                      <Mail className="w-3.5 h-3.5 animate-bounce" />
                      Ogeysiiska waa loo diray maamulka!
                    </div>
                  )}
                  {emailStatus === 'error' && (
                    <div className="bg-rose-600 text-white py-2.5 px-6 text-center text-[10px] font-sans font-bold tracking-wider uppercase flex items-center justify-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Cilad ayaa ka dhacday dirista Email-ka!
                    </div>
                  )}
                  {emailStatus === 'not_configured' && (
                    <div className="bg-amber-600 text-white py-2.5 px-6 text-center text-[10px] font-sans font-bold tracking-wider uppercase flex items-center justify-center gap-2">
                      <Settings className="w-3.5 h-3.5" />
                      Demo Mode (Ma jiro furayaal EmailJS)
                    </div>
                  )}

                  {/* Card Content */}
                  <div className="p-8 space-y-6">
                    {/* Header receipt info */}
                    <div className="text-center">
                      <h4 className="text-2xl font-display font-bold text-primary-900 leading-none mb-1">
                        BARAA RESTAURANT
                      </h4>
                      <p className="text-[10px] text-gray-500 font-sans tracking-widest uppercase">
                        Mogadishu, Somalia • Official Receipt
                      </p>
                    </div>

                    {/* QR Code and Booking Code Area */}
                    <div className="flex flex-col items-center justify-center py-4 bg-slate-50 rounded border border-gray-100">
                      <div className="grid grid-cols-5 gap-1.5 p-3.5 bg-white border border-gray-200 mb-3 rounded-sm">
                        {Array.from({ length: 25 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-3.5 h-3.5 rounded-sm ${
                              (i * 7 + 13) % 5 === 0 || i % 3 === 0 ? 'bg-primary-900' : 'bg-gray-100'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-sans font-bold tracking-widest text-gray-400">
                        BOOS-CELINTA CODE
                      </span>
                      <span className="text-lg font-mono font-bold text-primary-900">
                        {currentBooking.bookingCode}
                      </span>
                    </div>

                    {/* Receipt breakdown */}
                    <div className="space-y-3.5 text-xs">
                      <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                        <span className="text-gray-500">MACAAMIILKA:</span>
                        <span className="font-bold text-primary-900">{currentBooking.name}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                        <span className="text-gray-500">TIRADA DADKA:</span>
                        <span className="font-bold text-primary-900">{currentBooking.guests} Qofood</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                        <span className="text-gray-500">TAARIIKHDA:</span>
                        <span className="font-bold text-primary-900">{currentBooking.date}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                        <span className="text-gray-500">WAQTIGA:</span>
                        <span className="font-bold text-primary-900">{currentBooking.time} PM</span>
                      </div>
                      {currentBooking.requests && (
                        <div className="pb-2 border-b border-gray-100">
                          <span className="text-gray-500 block mb-1">CODSIGGA GAARKA AH:</span>
                          <span className="font-bold text-primary-900 italic block pl-2 border-l-2 border-gold-300">
                            "{currentBooking.requests}"
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                        <span className="text-gray-500">DIYAARINTA LACAGTA:</span>
                        <span className="font-bold text-primary-900 uppercase">
                          {currentBooking.paymentMethod.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Instruction footer */}
                    <div className="p-4 bg-amber-50 text-amber-900 rounded border border-amber-200 text-[11px] leading-relaxed">
                      <strong>Fariin:</strong> Ka wac telefoonkaaga <strong>*712*{currentBooking.paymentNumber}*2#</strong> si aad u bixiso boos-celinta $2.00. Fadlan soo qaado tigidhkan markaad imanayso maqaayada!
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-white rounded-lg p-8 border border-gray-200 shadow-md text-center flex flex-col items-center justify-center py-16">
                  <Ticket className="w-16 h-16 text-gray-300 mb-4 animate-bounce" />
                  <h4 className="text-base font-heading font-bold text-primary-900 mb-1">
                    Ma qabsatay miis?
                  </h4>
                  <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
                    Markaad foomka ballansashada buuxiso oo aad gudbiso, tigidhkaaga dhijitaalka ah ayaa halkan lagu soo saari doonaa.
                  </p>
                </div>
              )}
            </AnimatePresence>

            {/* List of past bookings stored in local storage */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-md">
              <h4 className="font-heading font-bold text-primary-900 text-sm mb-4 pb-2 border-b border-gray-100 flex items-center justify-between">
                <span>Taariikhda Ballansashada ({bookings.length})</span>
                {bookings.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    {isConfirmingDeleteAll ? (
                      <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 rounded px-2.5 py-1">
                        <span className="text-[10px] text-rose-700 font-bold">Ma hubtaa?</span>
                        <button
                          onClick={async () => {
                            try {
                              await fetch('/api/bookings', { method: 'DELETE' });
                            } catch (err) {
                              console.warn('Could not delete all from backend API', err);
                            }
                            setBookings([]);
                            localStorage.removeItem('baraa_bookings');
                            setCurrentBooking(null);
                            setIsConfirmingDeleteAll(false);
                          }}
                          className="bg-rose-600 hover:bg-rose-700 text-white font-sans font-bold text-[9px] px-2 py-0.5 rounded transition-all cursor-pointer"
                        >
                          Haa
                        </button>
                        <button
                          onClick={() => setIsConfirmingDeleteAll(false)}
                          className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-sans font-bold text-[9px] px-2 py-0.5 rounded transition-all cursor-pointer"
                        >
                          Maya
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setIsConfirmingDeleteAll(true)}
                        className="text-[10px] text-red-500 hover:underline flex items-center gap-1 font-bold tracking-wide cursor-pointer"
                      >
                        Tirtir Dhammaan
                      </button>
                    )}
                  </div>
                )}
              </h4>

              {bookings.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-6">
                  Weli ma jiraan ballansasho hore oo aad samaysay.
                </p>
              ) : (
                <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                  {bookings.map((b) => (
                    <div
                      key={b.id}
                      onClick={() => setCurrentBooking(b)}
                      className={`p-3.5 rounded border text-xs cursor-pointer transition-all flex justify-between items-center ${
                        currentBooking?.id === b.id
                          ? 'border-gold-500 bg-amber-50/20'
                          : 'border-gray-150 hover:bg-slate-50'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="font-bold text-primary-900 flex items-center gap-1.5">
                          <span>{b.name}</span>
                          <span className="text-[10px] font-mono text-gray-400 bg-slate-100 px-1 py-0.5 rounded">
                            {b.bookingCode}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500">
                          {b.date} • {b.time} PM • {b.guests} Qofood
                        </p>
                      </div>
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        {deletingId === b.id ? (
                          <div className="flex items-center gap-1 bg-rose-50 border border-rose-200 rounded p-1">
                            <span className="text-[9px] text-rose-700 font-bold px-1">Tirtir?</span>
                            <button
                              onClick={(e) => confirmDeleteBooking(b.id, e)}
                              className="bg-rose-500 hover:bg-rose-600 text-white p-1 rounded transition-colors cursor-pointer"
                              title="Haa, tirtir"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => cancelDeleteBooking(e)}
                              className="bg-slate-200 hover:bg-slate-300 text-slate-700 p-1 rounded transition-colors cursor-pointer"
                              title="Maya"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                            <button
                              onClick={(e) => deleteBooking(b.id, e)}
                              className="text-gray-400 hover:text-red-500 p-1.5 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                              title="Tirtir ballansashadan"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
