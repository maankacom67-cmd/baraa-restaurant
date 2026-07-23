import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Heart, Star, Sparkles, X, ShoppingCart, MessageSquare, 
  MapPin, Phone, ShoppingBag, CreditCard, CheckCircle2, ArrowLeft, 
  Mail, PhoneCall, AlertCircle, Settings, Plus, Minus, Check, Trash2
} from 'lucide-react';
import { MENU_ITEMS, CATEGORIES } from '../data';
import { MenuItem } from '../types';
import emailjs from '@emailjs/browser';
import { sendOrderToFirebase, handleOrderSubmit } from '../lib/firebase';

interface MenuShowcaseProps {
  onBookClick: () => void;
}

interface CartItem {
  id: string;
  item: MenuItem;
  quantity: number;
  notes: string;
}

export default function MenuShowcase({ onBookClick }: MenuShowcaseProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cartNotes, setCartNotes] = useState<string>('');
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);

  // Shopping Cart States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Home Delivery/Order States (Shared for Cart Checkout)
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [orderType, setOrderType] = useState<'delivery' | 'takeaway'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<'EVC Plus' | 'Zaad' | 'Sahal'>('EVC Plus');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderEmailStatus, setOrderEmailStatus] = useState<'idle' | 'success' | 'error' | 'not_configured'>('idle');
  const [placedOrderDetails, setPlacedOrderDetails] = useState<any | null>(null);

  // Helper: Add Item to Cart
  const addToCart = (item: MenuItem, qty: number = 1, notes: string = '') => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (cartItem) => cartItem.item.id === item.id && cartItem.notes === notes
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += qty;
        return updated;
      }
      return [
        ...prev,
        {
          id: Math.random().toString(36).substring(2, 9),
          item,
          quantity: qty,
          notes,
        },
      ];
    });
  };

  // Helper: Update Quantity in Cart
  const updateCartQuantity = (cartItemId: string, change: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = Math.max(1, item.quantity + change);
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  // Helper: Remove Item from Cart
  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  // Toggle favorite
  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  const [modalQuantity, setModalQuantity] = useState(1);

  // Handle selected item reset
  const handleItemSelect = (item: MenuItem) => {
    setSelectedItem(item);
    setPlacedOrderDetails(null);
    setOrderEmailStatus('idle');
    setCartNotes('');
    setModalQuantity(1);
  };

  // Filter items
  const filteredItems = MENU_ITEMS.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleMockPreOrder = () => {
    setShowOrderSuccess(true);
    setTimeout(() => {
      setShowOrderSuccess(false);
      setCartNotes('');
      setSelectedItem(null);
    }, 2500);
  };

  const handleCartCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (orderType === 'delivery' && !deliveryAddress) {
      alert('Fadlan qor meesha lagugu soo gaarsiinayo cuntada (Location).');
      return;
    }
    if (!customerPhone) {
      alert('Fadlan buuxi lambarkaaga taleefonka.');
      return;
    }

    setIsSubmittingOrder(true);
    setOrderEmailStatus('idle');

    const totalAmount = cart.reduce((sum, item) => sum + item.item.price * item.quantity, 0);
    const codeSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderCode = `ORD-2026-${codeSuffix}`;
    const createdAt = new Date().toLocaleDateString('so-SO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    // Format all items as readable lines for the email
    const itemsDescription = cart.map(
      (cartItem) => `- ${cartItem.item.name} (${cartItem.quantity}x) - $${(cartItem.item.price * cartItem.quantity).toFixed(2)}${cartItem.notes ? ` [Fiiro: ${cartItem.notes}]` : ''}`
    ).join('\n');

    const itemsBrief = cart.map(
      (cartItem) => `${cartItem.item.name} (x${cartItem.quantity})`
    ).join(', ');

    const finalAddress = orderType === 'takeaway' ? 'Maqaayada ayaan imaanayaa (Takeaway)' : deliveryAddress;

    // Build the HTML-formatted table string for cart items exactly as requested
    let cunnooyinHTML = "";
    cart.forEach(cartItem => {
      cunnooyinHTML += `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-family: sans-serif; font-size: 13px; color: #333;">
            <strong>${cartItem.item.name}</strong> (x${cartItem.quantity})
            ${cartItem.notes ? `<br/><span style="color: #ca8a04; font-size: 11px; font-style: italic;">Fiiro: "${cartItem.notes}"</span>` : ''}
          </td>
          <td style="padding: 8px; border: 1px solid #ddd; font-family: monospace; font-size: 13px; font-weight: bold; color: #111; text-align: right;">
            $${(cartItem.item.price * cartItem.quantity).toFixed(2)}
          </td>
        </tr>
      `;
    });

    const fullCunnooyinHTML = `
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 15px;">
        <thead>
          <tr style="background-color: #f8fafc; border-bottom: 2px solid #e2e8f0;">
            <th style="padding: 10px 8px; border: 1px solid #ddd; text-align: left; font-family: sans-serif; font-size: 12px; font-weight: bold; color: #475569; text-transform: uppercase;">Cuntada (Cunto)</th>
            <th style="padding: 10px 8px; border: 1px solid #ddd; text-align: right; font-family: sans-serif; font-size: 12px; font-weight: bold; color: #475569; text-transform: uppercase; width: 100px;">Qiimaha</th>
          </tr>
        </thead>
        <tbody>
          ${cunnooyinHTML}
        </tbody>
      </table>
    `;

    const orderDetails = {
      id: Math.random().toString(36).substring(2, 9),
      customerName: customerName || 'Macmiil',
      customerPhone,
      deliveryAddress: finalAddress,
      itemName: itemsBrief,
      itemPrice: 0,
      quantity: cart.reduce((sum, item) => sum + item.quantity, 0),
      totalAmount,
      paymentMethod,
      orderCode,
      createdAt,
      cartNotes: cartNotes || 'Ma jiraan codsiyo gaar ah'
    };

    // EmailJS credentials hardcoded as string literals (with env fallback) for Netlify compatibility
    const metaEnv = (typeof import.meta !== 'undefined' && (import.meta as any).env) || {};
    const serviceId = metaEnv.VITE_EMAILJS_SERVICE_ID || "service_baraa_restaurant";
    const templateId = metaEnv.VITE_EMAILJS_TEMPLATE_ID || "template_baraa_order";
    const publicKey = metaEnv.VITE_EMAILJS_PUBLIC_KEY || "public_key_baraa_123";

    // Diyaarinta fariinta loo dirayo EmailJS (Iyadoo la isticmaalayo furayaasha cusub iyo kuwii hore labadaba si loo hubsado)
    const templateParams = {
      // New Somali-keyed template parameters requested
      magaca: customerName || 'Macmiil',
      teleefonka: customerPhone,
      location: finalAddress,
      habka_dalabka: orderType === 'takeaway' ? 'Maqaayada ayaan imaanayaa (Takeaway)' : 'Waa lay keenayaa (Home Delivery)',
      lacag_bixinta: paymentMethod,
      subtotal: totalAmount.toFixed(2),
      cunnooyinka_la_dalbaday: fullCunnooyinHTML,

      // Backwards/Alternative template support for existing structures
      name: `Dalab Cusub (${paymentMethod}) - ${orderType === 'takeaway' ? 'Maqaayada' : 'Keenis'}`,
      email: customerPhone, // Lambarka macmiilka
      title: `Cunto Dalab - ${finalAddress}`,
      message: `
        📍 Nooca Dalabka: ${orderType === 'takeaway' ? 'Maqaayada ayaan imaanayaa (Takeaway)' : 'Waa lay keenayaa (Home Delivery)'}
        📍 Meesha uu joogo: ${finalAddress}
        🍔 Waxa uu dalbaday:
        ${itemsDescription}
        
        🔢 Tirada Guud: ${cart.reduce((sum, item) => sum + item.quantity, 0)} xabo
        📞 Lambarkiisa: ${customerPhone}
        💳 Habka Lacagta: ${paymentMethod}
      `,
      to_name: 'Baraa Restaurant Admin',
      customer_name: customerName || 'Macmiil',
      customer_phone: customerPhone,
      delivery_address: finalAddress,
      item_name: itemsBrief,
      item_price: '',
      quantity: cart.reduce((sum, item) => sum + item.quantity, 0),
      total_amount: totalAmount.toFixed(2),
      payment_method: paymentMethod,
      booking_code: orderCode,
      special_requests: cartNotes || 'Ma jiraan codsiyo gaar ah',
      created_at: createdAt,
      admin_email: 'maankacom66@gmail.com'
    };

    if (serviceId && templateId && publicKey) {
      try {
        await emailjs.send(serviceId, templateId, templateParams, publicKey);
        setOrderEmailStatus('success');

        // 2. Alert success
        alert("Dalabkaaga waa la diray! Hada waxaa laguu wareejinayaa bixinta lacagta...");

        // 3. Toos ugu wareeji garaaca taleefonka (Call Phone) qaabka USSD-ka ah
        // Code-ka USSD: *712*771909054*lacagta#
        const roundedAmount = Math.round(totalAmount) || 1;
        window.location.href = `tel:*712*771909054*${roundedAmount}%23`;
      } catch (error) {
        console.error('EmailJS Order Send Error:', error);
        setOrderEmailStatus('error');
      }
    } else {
      console.warn('EmailJS keys are not configured yet for orders.');
      setOrderEmailStatus('not_configured');

      // Still provide flow in Demo Mode for preview and local testing
      alert("Dalabkaaga waa la diray (DEMO/TEST MODE)! Hada waxaa laguu wareejinayaa bixinta lacagta...");
      const roundedAmount = Math.round(totalAmount) || 1;
      window.location.href = `tel:*712*771909054*${roundedAmount}%23`;
    }

    // Save order details to Firebase Firestore (collection: "orders")
    try {
      const formData = {
        name: customerName || "Macmiil",
        phone: customerPhone || "",
        location: finalAddress || "",
        deliveryMethod: orderType === 'takeaway' ? 'Takeaway' : 'Home Delivery',
        paymentMethod: paymentMethod || "EVC Plus",
        totalAmount: typeof totalAmount === 'number' ? `$${totalAmount.toFixed(2)}` : (totalAmount || "$0.00")
      };
      const cartItems = cart.map(c => ({
        name: c.item.name || (c.item as any).title || "Cunto",
        quantity: c.quantity || 1,
        price: typeof c.item.price === 'number' ? `$${c.item.price.toFixed(2)}` : (c.item.price || "$0.00")
      }));

      await handleOrderSubmit(formData, cartItems);
    } catch (fbErr) {
      console.warn('Could not save order to Firebase:', fbErr);
    }

    // Save order details to the backend database API
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: orderDetails.id,
          customerName: orderDetails.customerName,
          customerPhone: orderDetails.customerPhone,
          address: orderDetails.deliveryAddress,
          orderType,
          paymentMethod,
          items: cart,
          totalAmount,
        }),
      });
    } catch (dbErr) {
      console.warn('Could not save order to backend database API', dbErr);
    }

    setPlacedOrderDetails(orderDetails);
    setIsSubmittingOrder(false);
  };

  return (
    <section className="py-20 bg-slate-50 text-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Title */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-gold-600 font-sans font-bold text-xs tracking-[0.25em] uppercase block mb-3">
            DOORASHADA KUUGGA
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-900 mb-4">
            Menyada Gaarka Ah
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Waxaan kuu soo xulnay cuntooyin dabeeci ah oo ku duban xawaashyada asalka ah. Dooro cuntada aad jeceshahay si aad u ogaato sirta ku qarsoon dhadhankayaga.
          </p>
        </div>

        {/* Search & Category Tabs Control Panel */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-10 pb-6 border-b border-gray-200">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-4 py-2.5 rounded-full text-xs font-sans font-semibold tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat.key
                    ? 'bg-primary-900 text-gold-400 shadow-md shadow-primary-900/15'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Raadi cunto ama cabitaan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-sm py-2.5 pl-10 pr-4 rounded-full border border-gray-200 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-gray-400 hover:text-gray-600 absolute right-3.5 top-1/2 -translate-y-1/2"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Menu Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => {
              const isFavorite = favorites.includes(item.id);
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  key={item.id}
                  onClick={() => handleItemSelect(item)}
                  className="bg-white rounded-md overflow-hidden border border-gray-200 hover:border-gray-300/80 hover:shadow-xl transition-all cursor-pointer group flex flex-col h-full"
                >
                  {/* Food Image Container */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Tags Overlays */}
                    {item.isFeatured && (
                      <span className="absolute top-3 left-3 bg-gold-400 text-primary-950 text-[9px] font-sans font-bold tracking-wider px-2 py-1 rounded flex items-center gap-1 shadow-md">
                        <Sparkles className="w-2.5 h-2.5" />
                        SIGNATURE
                      </span>
                    )}

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => toggleFavorite(item.id, e)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-600 hover:text-red-500 hover:scale-110 transition-all shadow-md"
                    >
                      <Heart
                        className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`}
                      />
                    </button>

                    {/* Price Overlay */}
                    <div className="absolute bottom-3 right-3 bg-primary-900/90 text-gold-400 px-3 py-1.5 rounded-sm font-sans font-bold text-sm">
                      ${item.price.toFixed(2)}
                    </div>
                  </div>

                  {/* Food Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h3 className="text-lg font-heading font-bold text-primary-900 group-hover:text-gold-600 transition-colors">
                        {item.name}
                      </h3>
                      {item.rating && (
                        <div className="flex items-center gap-1 text-amber-500 text-xs font-bold shrink-0 mt-1">
                          <Star className="w-3.5 h-3.5 fill-amber-500" />
                          <span>{item.rating}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-gray-600 text-xs leading-relaxed mb-4 flex-grow line-clamp-3">
                      {item.description}
                    </p>

                    {/* Tags/Category labels */}
                    <div className="flex flex-wrap gap-1.5 mt-auto pt-3 border-t border-gray-100">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-slate-100 text-[10px] font-sans font-semibold text-slate-600 px-2 py-0.5 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Quick Add To Cart Button */}
                    <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100">
                      <span className="text-sm font-sans font-bold text-gold-700">
                        ${item.price.toFixed(2)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(item, 1, '');
                          setIsCartOpen(true);
                        }}
                        className="bg-gold-500 hover:bg-gold-400 active:scale-95 text-primary-950 font-sans font-bold text-[10.5px] tracking-wider px-3.5 py-2 rounded flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:shadow-md"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        Ku dar Dalabka
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16 bg-white rounded-md border border-gray-200 mt-6">
            <p className="text-gray-500 text-sm">Cunto u dhiganta baaritaankaaga lama helin. Fadlan isku day erey kale.</p>
          </div>
        )}

        {/* Floating Reservation Banner */}
        <div className="mt-16 bg-primary-900 rounded-lg p-8 md:p-12 text-white flex flex-col md:flex-row gap-8 items-center justify-between shadow-xl">
          <div className="max-w-xl text-center md:text-left">
            <h3 className="text-2xl font-display font-bold mb-3 text-gold-400">
              Ma doonaysaa jawi gaar ah?
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Buug-garayso miiskaaga maanta si aad u hesho cuntooyin gaar ah oo kulul iyo adeeg gaar ah oo hufan oo ay diyaariyeen kuugyadeena ugu fiican.
            </p>
          </div>
          <button
            onClick={onBookClick}
            className="bg-gold-500 hover:bg-gold-400 text-primary-950 font-sans font-bold text-xs tracking-widest px-8 py-4 rounded-sm whitespace-nowrap hover:shadow-lg transition-all cursor-pointer shrink-0"
          >
            BALLANSO MIISKAAGA HADA
          </button>
        </div>
      </div>

      {/* Detail Overlay Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="fixed inset-0 bg-primary-950/80 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-white rounded-lg overflow-hidden shadow-2xl z-10 border border-gray-100 my-8"
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all z-20 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Modal Image & Summary Column */}
                <div className="relative bg-slate-900 text-white flex flex-col justify-between">
                  <div className="absolute inset-0 z-0">
                    <img
                      src={selectedItem.imageUrl}
                      alt={selectedItem.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-primary-950/80 via-primary-950/50 to-primary-950/95" />
                  </div>

                  <div className="relative z-10 p-8 space-y-4">
                    <span className="text-gold-400 font-sans font-bold text-[10px] tracking-widest uppercase block">
                      {selectedItem.category === 'appetizer' && 'Cunto Fudud'}
                      {selectedItem.category === 'main' && 'Cuntada Rasmiga ah'}
                      {selectedItem.category === 'drink' && 'Cabitaan ama Kafee'}
                      {selectedItem.category === 'dessert' && 'Macmacaan'}
                    </span>
                    <h3 className="text-3xl font-heading font-bold text-white tracking-tight leading-tight">
                      {selectedItem.name}
                    </h3>
                    <p className="text-xs text-gray-300 leading-relaxed max-w-sm">
                      {selectedItem.description}
                    </p>
                  </div>

                  <div className="relative z-10 p-8 bg-black/40 border-t border-white/5 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400 font-sans">Qiimaha Cuntada:</span>
                      <span className="text-lg font-bold text-gold-400 font-sans">${selectedItem.price.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400 font-sans">Tirada la doonayo:</span>
                      <span className="text-sm font-bold text-white font-mono">{modalQuantity} xabo</span>
                    </div>
                    <div className="h-px bg-white/10 my-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-white font-sans font-bold">Isugeynta (Total):</span>
                      <span className="text-xl font-bold text-gold-400 font-sans">
                        ${(selectedItem.price * modalQuantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Interactive Modal Form / Actions Column */}
                <div className="p-8 bg-white flex flex-col justify-center min-h-[450px]">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-amber-500 text-sm font-bold">
                        <Star className="w-4 h-4 fill-amber-500" />
                        <span>{selectedItem.rating || '4.8'} ee darajada cuntada</span>
                      </div>
                      <p className="text-gray-600 text-xs leading-relaxed">
                        Cuntadan waxaa si farshaxanimo leh u diyaariyey kuugyadeena xirfadda sare leh, iyagoo isticmaalaya maaddooyin dabiici ah oo gabi ahaanba cusub oo laga keenay beeraheena rasmiga ah.
                      </p>
                    </div>

                    {/* Extra requirements notes textarea */}
                    <div>
                      <label className="block text-[10px] font-sans font-bold text-gray-500 uppercase mb-2 flex items-center gap-1.5">
                        <MessageSquare className="w-3 h-3 text-gold-600" />
                        Codsiyada Gaarka ah / Notes (Tus. "Ha ku darin basasha")
                      </label>
                      <textarea
                        rows={2}
                        value={cartNotes}
                        onChange={(e) => setCartNotes(e.target.value)}
                        placeholder="Wax ma naga codsanaysaa ku saabsan diyaarinta..."
                        className="w-full bg-slate-50 text-xs p-3 rounded border border-gray-200 focus:outline-none focus:border-gold-500 transition-colors"
                      />
                    </div>

                    {/* Order Options */}
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                      {/* Quantity Selector inside detail modal right column too */}
                      <div className="flex items-center justify-between gap-3 bg-slate-50 p-3 rounded-md border border-slate-100">
                        <span className="text-xs font-sans font-bold text-slate-700">Tirada (Quantity):</span>
                        <div className="flex items-center gap-3 bg-white border border-slate-200 px-2.5 py-1 rounded shadow-sm">
                          <button 
                            type="button" 
                            onClick={() => setModalQuantity(prev => Math.max(1, prev - 1))}
                            className="text-slate-600 hover:text-gold-600 cursor-pointer p-0.5"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-bold text-xs min-w-[16px] text-center font-mono text-slate-800">{modalQuantity}</span>
                          <button 
                            type="button" 
                            onClick={() => setModalQuantity(prev => prev + 1)}
                            className="text-slate-600 hover:text-gold-600 cursor-pointer p-0.5"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Add to order / cart button */}
                      <button
                        onClick={() => {
                          addToCart(selectedItem, modalQuantity, cartNotes);
                          setSelectedItem(null);
                          setIsCartOpen(true);
                        }}
                        className="w-full bg-gold-500 hover:bg-gold-400 text-primary-950 font-sans font-bold text-xs tracking-widest py-3.5 rounded flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-gold-500/10"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        KU DAR DALABKA (Cart) - ${(selectedItem.price * modalQuantity).toFixed(2)}
                      </button>

                      {/* Table reservation button */}
                      <button
                        onClick={() => {
                          setSelectedItem(null);
                          onBookClick();
                        }}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-sans font-bold text-xs tracking-widest py-3.5 rounded transition-all cursor-pointer text-center"
                      >
                        BALLANSO MIIS HADA
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Shopping Cart Button/Badge */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 right-6 z-40">
          <motion.button
            initial={{ scale: 0, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: 50 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setPlacedOrderDetails(null);
              setIsCartOpen(true);
            }}
            className="bg-primary-900 text-gold-400 hover:bg-primary-950 font-sans font-bold text-sm tracking-wide p-4 rounded-full flex items-center gap-3 shadow-2xl border border-gold-500/30 cursor-pointer"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 text-gold-400" />
              <span className="absolute -top-2.5 -right-2.5 bg-gold-500 text-primary-950 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>
            <div className="flex flex-col items-start pr-1">
              <span className="text-[10px] text-slate-300 font-normal leading-none mb-0.5">DALABKAAGA</span>
              <span className="text-xs font-bold font-mono leading-none">
                ${cart.reduce((sum, item) => sum + item.item.price * item.quantity, 0).toFixed(2)}
              </span>
            </div>
          </motion.button>
        </div>
      )}

      {/* Shopping Cart Modal / Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-primary-950/80 backdrop-blur-sm"
            />

            {/* Cart Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-lg overflow-hidden shadow-2xl z-10 border border-gray-100 my-8 flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="bg-primary-900 text-white p-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-gold-400" />
                  <h3 className="text-xl font-heading font-bold text-white">
                    Kandhalkaaga Dalabka
                  </h3>
                  <span className="bg-gold-500 text-primary-950 text-xs font-bold px-2.5 py-0.5 rounded-full ml-1">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)} xabo
                  </span>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Content Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {placedOrderDetails ? (
                  /* Success Receipt View */
                  <div className="space-y-6 py-4">
                    <div className="text-center space-y-2">
                      <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h4 className="text-xl font-heading font-bold text-primary-900">
                        Dalabkaaga waa la Gudbiyay!
                      </h4>
                      <p className="text-xs text-slate-500 font-sans tracking-wide">
                        Tigidhkaaga: <span className="font-bold text-slate-800 font-mono bg-slate-100 px-2 py-0.5 rounded">{placedOrderDetails.orderCode}</span>
                      </p>
                    </div>

                    {orderEmailStatus === 'success' && (
                      <div className="bg-emerald-50 text-emerald-800 p-3 rounded border border-emerald-200 text-xs font-sans font-bold flex items-center gap-1.5 justify-center">
                        <Mail className="w-4 h-4 shrink-0" />
                        Dalabka waxaa si guul leh loogu diray Maamulka Baraa!
                      </div>
                    )}
                    {orderEmailStatus === 'error' && (
                      <div className="bg-rose-50 text-rose-800 p-3 rounded border border-rose-200 text-xs font-sans font-bold flex items-center gap-1.5 justify-center">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        Cilad ayaa dhacday markii macluumaadka loo dirayay Gmail-ka!
                      </div>
                    )}
                    {orderEmailStatus === 'not_configured' && (
                      <div className="bg-amber-50 text-amber-800 p-3 rounded border border-amber-200 text-xs font-sans font-bold flex items-center gap-1.5 justify-center">
                        <Settings className="w-4 h-4 shrink-0" />
                        Dalabku wuxuu ku jiraa Demo Mode (Fadlan deji EmailJS)
                      </div>
                    )}

                    <div className="bg-slate-50 p-5 rounded-md border border-slate-200 space-y-4 text-xs text-slate-700 leading-normal">
                      <p className="font-bold text-slate-800 border-b border-slate-200 pb-2 text-sm">Faahfaahinta Dalabkaaga:</p>
                      
                      <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                        {cart.map((cartItem) => (
                          <div key={cartItem.id} className="flex justify-between text-xs text-slate-600">
                            <span>{cartItem.item.name} <strong className="text-slate-800 font-mono">x{cartItem.quantity}</strong></span>
                            <span className="font-mono">${(cartItem.item.price * cartItem.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="border-t border-slate-200 pt-3 grid grid-cols-2 gap-x-2 gap-y-2 text-xs">
                        <span className="text-slate-500">Macaamiilka:</span>
                        <span className="font-semibold text-slate-800 text-right">{placedOrderDetails.customerName}</span>

                        <span className="text-slate-500">Taleefanka:</span>
                        <span className="font-semibold text-slate-800 text-right">{placedOrderDetails.customerPhone}</span>

                        <span className="text-slate-500">Meesha la gaynayo (Location):</span>
                        <span className="font-semibold text-slate-800 text-right">{placedOrderDetails.deliveryAddress}</span>

                        <span className="text-slate-500 font-bold">Isugeynta guud:</span>
                        <span className="font-bold text-gold-700 text-right text-sm">${placedOrderDetails.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* USSD Direct Call button section */}
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded space-y-2.5 text-center">
                      <p className="text-xs font-sans font-bold text-amber-800 uppercase tracking-wider">Guji badanka hoose si aad u bixiso kharashka:</p>
                      <a 
                        href={`tel:*712*771909054*${Math.round(placedOrderDetails.totalAmount)}%23`}
                        className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-sans font-bold text-sm tracking-wider px-6 py-3 rounded shadow-sm hover:shadow-md transition-all cursor-pointer w-full justify-center"
                      >
                        <PhoneCall className="w-4 h-4 animate-bounce" />
                        GARAAC *712*771909054*{Math.round(placedOrderDetails.totalAmount)}#
                      </a>
                      <span className="text-[10px] text-amber-700 block">Sitoos ah ayuu kuugu geynayaa fariinta wicitaanka taleefankaaga hadda.</span>
                    </div>

                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        setPlacedOrderDetails(null);
                        setCart([]); // Clear cart upon closing receipt
                      }}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-sans font-bold text-xs tracking-widest py-3.5 rounded transition-all cursor-pointer text-center"
                    >
                      XIDH / KU LAABO MENYADA
                    </button>
                  </div>
                ) : cart.length === 0 ? (
                  /* Empty Cart View */
                  <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mx-auto">
                      <ShoppingCart className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-800">Kandhalkaaga dalabku waa maran yahay!</h4>
                      <p className="text-xs text-slate-500 mt-1">Dooro cuntooyin macaan si aad halmar u wada dalbato.</p>
                    </div>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="inline-flex items-center gap-1.5 text-xs text-gold-600 hover:text-gold-700 font-bold uppercase tracking-wider"
                    >
                      Xidh oo raadi cunto
                    </button>
                  </div>
                ) : (
                  /* Active Cart & Checkout Form View */
                  <div className="space-y-6">
                    {/* Items List */}
                    <div className="space-y-3.5">
                      <span className="text-[10px] font-sans font-bold text-slate-500 uppercase tracking-widest block">
                        CUNTOOYINKA AAD DOORATAY:
                      </span>
                      <div className="divide-y divide-slate-100 border border-slate-100 rounded-lg overflow-hidden bg-white shadow-sm">
                        {cart.map((cartItem) => (
                          <div key={cartItem.id} className="p-4 flex gap-4 items-center justify-between">
                            <div className="flex gap-3 items-center min-w-0">
                              <img 
                                src={cartItem.item.imageUrl} 
                                alt={cartItem.item.name} 
                                className="w-12 h-12 rounded object-cover shrink-0 bg-slate-50"
                              />
                              <div className="min-w-0">
                                <h5 className="text-xs font-bold text-primary-950 truncate">{cartItem.item.name}</h5>
                                <p className="text-[10px] text-slate-500 font-mono">${cartItem.item.price.toFixed(2)} xabo kasta</p>
                                {cartItem.notes && (
                                  <p className="text-[10px] text-amber-600 italic truncate mt-0.5">Notes: "{cartItem.notes}"</p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-4 shrink-0">
                              {/* Quantity Controls */}
                              <div className="flex items-center gap-2.5 bg-slate-100 p-1 rounded-sm">
                                <button
                                  type="button"
                                  onClick={() => updateCartQuantity(cartItem.id, -1)}
                                  className="w-5 h-5 rounded-sm bg-white text-slate-700 hover:bg-slate-200 flex items-center justify-center cursor-pointer transition-colors"
                                >
                                  <Minus className="w-2.5 h-2.5" />
                                </button>
                                <span className="text-xs font-bold text-slate-800 font-mono min-w-[12px] text-center">{cartItem.quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => updateCartQuantity(cartItem.id, 1)}
                                  className="w-5 h-5 rounded-sm bg-white text-slate-700 hover:bg-slate-200 flex items-center justify-center cursor-pointer transition-colors"
                                >
                                  <Plus className="w-2.5 h-2.5" />
                                </button>
                              </div>

                              {/* Price Subtotal */}
                              <span className="text-xs font-bold text-slate-900 font-mono min-w-[50px] text-right">
                                ${(cartItem.item.price * cartItem.quantity).toFixed(2)}
                              </span>

                              {/* Delete Button */}
                              <button
                                type="button"
                                onClick={() => removeFromCart(cartItem.id)}
                                className="text-slate-400 hover:text-red-500 transition-colors p-1"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Total Calculation */}
                    <div className="bg-slate-50 p-4 rounded-md border border-slate-200 flex justify-between items-center">
                      <span className="text-xs font-sans font-bold text-slate-700 uppercase">ISUGEYNTA GUUD (SUBTOTAL):</span>
                      <span className="text-lg font-bold text-gold-700 font-mono">
                        ${cart.reduce((sum, item) => sum + item.item.price * item.quantity, 0).toFixed(2)}
                      </span>
                    </div>

                               {/* Checkout Form within Cart */}
                    <form onSubmit={handleCartCheckoutSubmit} className="space-y-4 pt-4 border-t border-slate-100">
                      <span className="text-[10px] font-sans font-bold text-slate-500 uppercase tracking-widest block">
                        MACLUUMAADKA KEENISTA & LACAGTA:
                      </span>

                      {/* Order Type Selector */}
                      <div className="space-y-2">
                        <label className="block text-[11px] font-sans font-bold text-gray-700 uppercase tracking-wider">
                          🛎️ Habka Dalabka / Nooca Dalabka *
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setOrderType('delivery')}
                            className={`py-3 px-4 text-xs font-sans font-bold rounded border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                              orderType === 'delivery'
                                ? 'bg-primary-900 border-primary-900 text-gold-400 shadow-sm'
                                : 'bg-slate-50 border-gray-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <span>🛵</span> Waa lay keenayaa (Delivery)
                          </button>
                          <button
                            type="button"
                            onClick={() => setOrderType('takeaway')}
                            className={`py-3 px-4 text-xs font-sans font-bold rounded border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                              orderType === 'takeaway'
                                ? 'bg-primary-900 border-primary-900 text-gold-400 shadow-sm'
                                : 'bg-slate-50 border-gray-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <span>🍽️</span> Maqaayada ayaan imaanayaa
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Location / Takeaway Info */}
                        {orderType === 'delivery' ? (
                          <div>
                            <label className="block text-[11px] font-sans font-bold text-gray-700 mb-1 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-gold-600" />
                              📍 Meesha aad joogto (Location) *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="Tusaale: Hodan, Muqdisho"
                              value={deliveryAddress}
                              onChange={(e) => setDeliveryAddress(e.target.value)}
                              className="w-full bg-slate-50 text-xs p-2.5 rounded border border-gray-200 focus:outline-none focus:border-gold-500 transition-colors"
                            />
                          </div>
                        ) : (
                          <div className="bg-amber-50/70 border border-amber-100 p-2.5 rounded-md flex items-start gap-2 text-amber-900 text-[11px] font-sans h-full">
                            <span className="text-sm shrink-0">📍</span>
                            <span>Cuntada waxaa laguugu diyaarin doonaa <strong>Maqaayada Barada</strong> si aad adigu halkaas uga qaadato marka ay diyaar noqoto.</span>
                          </div>
                        )}

                        {/* Phone */}
                        <div>
                          <label className="block text-[11px] font-sans font-bold text-gray-700 mb-1 flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-gold-600" />
                            📞 Lambarkaaga Taleefonka *
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="061xxxxxxx"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            className="w-full bg-slate-50 text-xs p-2.5 rounded border border-gray-200 focus:outline-none focus:border-gold-500 transition-colors"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Name (Optional) */}
                        <div>
                          <label className="block text-[11px] font-sans font-bold text-gray-700 mb-1">
                            👤 Magacaaga (Optional)
                          </label>
                          <input
                            type="text"
                            placeholder="Tusaale: Axmed Cali"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="w-full bg-slate-50 text-xs p-2.5 rounded border border-gray-200 focus:outline-none focus:border-gold-500 transition-colors"
                          />
                        </div>

                        {/* Payment Method */}
                        <div>
                          <label className="block text-[11px] font-sans font-bold text-gray-700 mb-1 flex items-center gap-1">
                            <CreditCard className="w-3.5 h-3.5 text-gold-600" />
                            💳 Qaybta Lacag Bixinta *
                          </label>
                          <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value as any)}
                            className="w-full p-2.5 bg-slate-50 border rounded text-xs focus:outline-none focus:border-gold-500 transition-colors"
                          >
                            <option value="EVC Plus">EVC Plus</option>
                            <option value="Zaad">Zaad</option>
                            <option value="Sahal">Sahal</option>
                          </select>
                        </div>
                      </div>

                      {/* Live Interactive USSD payment advice */}
                      {customerPhone && (
                        <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1.5 text-[10px] text-slate-600 leading-normal">
                          <span className="font-bold text-slate-800 block text-[9px] tracking-wide uppercase">XAQIIJINTA USSD CODE KA</span>
                          <p>
                            Markaad gujiso badanka hoose, fadlan garaac lambarkan si aad u bixiso xaddiga guud ee ah <strong className="text-gold-700">${cart.reduce((sum, item) => sum + item.item.price * item.quantity, 0).toFixed(2)}</strong>:
                          </p>
                          <code className="block bg-slate-100 p-1.5 rounded text-center text-slate-800 font-bold text-xs font-mono">
                            *712*771909054*{Math.round(cart.reduce((sum, item) => sum + item.item.price * item.quantity, 0))}#
                          </code>
                        </div>
                      )}

                      {/* Submit Order */}
                      <button
                        type="submit"
                        disabled={isSubmittingOrder}
                        className="w-full bg-gold-500 hover:bg-gold-400 text-primary-950 font-sans font-bold text-xs tracking-widest py-3.5 rounded flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50"
                      >
                        {isSubmittingOrder ? 'Gudbinaya dalabka...' : 'Xaqiiji Dalabka & Bixi Lacagta'}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
