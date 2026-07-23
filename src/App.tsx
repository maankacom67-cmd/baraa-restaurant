import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, ArrowRight, Utensils, ChefHat, Clock, Phone, MapPin, Mail, Globe, Sparkles, Star, MessageCircle, Facebook, Instagram } from 'lucide-react';

// Component Imports
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MenuShowcase from './components/MenuShowcase';
import ReservationForm from './components/ReservationForm';
import AboutUs from './components/AboutUs';
import ReviewsSection from './components/ReviewsSection';
import BaraaLogo from './components/BaraaLogo';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'menu' | 'about' | 'book' | 'reviews'>('home');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between">
      {/* Top Navbar */}
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main Sections Switcher */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {currentTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Hero Screen */}
              <Hero setCurrentTab={setCurrentTab} />

              {/* Bento Grid: Somali Culinary Heritage */}
              <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  
                  {/* Left Content Column */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="h-1 w-20 bg-gold-500 rounded-full" />
                    <span className="text-gold-600 font-sans font-bold text-xs tracking-widest uppercase block">
                      FARXADDA CUNNADA ASALKA AH
                    </span>
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-900 leading-tight">
                      Farsamada Cunnada ee Heerka Sare
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Baraa Restaurant waxaan isku dhisnay hiddaha iyo casriga. Kuugyadeena aqoonta leh waxay isticmaalaan waxyaabaha ugu fiican ee laga helo deegaanka si ay kuu siiyaan dhadhan aan marnaba maskaxdaada ka bixi doonin.
                    </p>

                    <ul className="space-y-3 pt-2">
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-gold-500 shrink-0" />
                        <span className="text-xs font-sans font-bold text-primary-900 tracking-wider uppercase">DHAQAN IYO DHADHAN ASAL AH</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-gold-500 shrink-0" />
                        <span className="text-xs font-sans font-bold text-primary-900 tracking-wider uppercase">ADEEGE QALBI FURAN OO DHURSAN</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-gold-500 shrink-0" />
                        <span className="text-xs font-sans font-bold text-primary-900 tracking-wider uppercase">JAWI GAAR AH OO LOOGU TALAGALAY QAYSAASKA</span>
                      </li>
                    </ul>

                    <button
                      onClick={() => {
                        setCurrentTab('about');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="group inline-flex items-center gap-2 text-primary-900 hover:text-gold-600 font-sans font-bold text-xs tracking-wider uppercase pt-4 transition-colors cursor-pointer"
                    >
                      <span>AKHRI SHEEKADEENA</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                    </button>
                  </div>

                  {/* Right Graphics Bento Layout */}
                  <div className="lg:col-span-7 grid grid-cols-2 gap-4 h-[550px]">
                    <div className="relative overflow-hidden rounded-md col-span-1 row-span-2 border border-gray-200 shadow-md group">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzEemIynUqKSJqt2boD0uBdv4JIkCwYKgRJub_bRKHt0aNrMFSAqluj__RNLB9zQESnUTYnw4-WzXiX1KUvqa_mvq0-AxhwO0UWjDXShZ-E63-jt65sPXJ34vda30uCEBnalQwkgd53FdX0D4vJpfyBO4l8dEnUIR4Tsqv6gTCJKMd_4DaoiX8Z37L3LUx8_jPXQrQCd-I74gY6ORvBSKJSURKUAfLd1C9zGlc_wIFibTJupAifpM5dHZQUOjc7Pz6ss0"
                        alt="Cooking visual"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                    <div className="relative overflow-hidden rounded-md col-span-1 row-span-1 border border-gray-200 shadow-md group">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPDr7Ng5MEIso-WCHqf-zTG8AgFv7VnG0TbOx_7r7Wa_whMB1DgHM3KH1jzG-AVktp_xKfjAtZPcMEV-P5kaABE3YN4qidpQFL0aQrJ-sN59QRzpkYl-MWaTD_43nqlwL8NHHdV5E9J7ZF8uKuRKQaKlY2c8nFZL8JCuhf7UpXmMGPtQGr5f7GW8zINr2QF_gbn6WdUWzBnj6xGvUl5pLsB-dYcZqRT58wdjqMckUE-gY8da37JBG-yeR3Y7Wh_jeMleQ"
                        alt="Appetizer dish"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="relative overflow-hidden rounded-md col-span-1 row-span-1 border border-gray-200 shadow-md group">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBajBZkS8d3TPsYKJlmYJXC9zR1efD2_yMbz_yCmf4IcUV_YX-rFOnFdSFbopSZC8U0ArLMLsttfl6thzPNo1qMHU9wMPi-_7mLmY4muvtdrFqTM-bO_FGW_r4eBgdGcyc-cVogV4_fh4zpSf3etDix7IxTqwFkU2HR1DYqX6spmfhWO6eQhmo-Fp_SbhT1cugDWYCLk5gGMR0njsq6IiAri8Pgt9JOriyYA6gSdukLoJNOQMauYRW5nOjAuHPtVVd_PY4"
                        alt="Dessert selection"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  </div>

                </div>
              </section>

              {/* Chef's Choice Highlight Grid (3 items preview) */}
              <section className="py-24 bg-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                  
                  <div className="text-center max-w-xl mx-auto mb-16">
                    <span className="text-gold-600 font-sans font-bold text-xs tracking-widest uppercase block mb-3">
                      CUNTADA LOOGU JECEL YAHAY
                    </span>
                    <h3 className="text-3xl md:text-4xl font-display font-bold text-primary-900">
                      Cuntooyinka Gaarka Ah
                    </h3>
                    <p className="text-gray-600 text-sm mt-3 leading-relaxed">
                      Ku raaxayso qaar ka mid ah cuntooyinkayada ugu caansan ee macaamiisheenu mar kasta doorbidaan marka ay Baraa soo booqdaan.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Item 1 */}
                    <div className="bg-white rounded-md overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all p-6 flex flex-col group cursor-pointer" onClick={() => setCurrentTab('menu')}>
                      <div className="aspect-video overflow-hidden rounded mb-4 bg-gray-50">
                        <img
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXL5dozmPTNVLTg26q2tP-E_H4ZOASLUdkvKSB6M03vL5k46IqrabjfZIlF5CdQuufPZktQJtUu0yOYY35_hlNCorakVc57C2uBEXhQtvvCdivmegHsE-H8kam3eLEid2pRxojTpF38UHkO7FuaTpRuboLKid0D2yui2Duc00atI3mGI-1_yNYVgXiSQjIjRTg9WfZjn0_kjCqB_Ed77aCps3w9FqeeRc0BeCwJfxyNBb8qPGfQ6h8OMAz1eDcwL6-0MY"
                          alt="Baastada Baraa"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex justify-between items-baseline mb-2">
                        <h4 className="font-heading font-bold text-lg text-primary-900">Baastada Baraa</h4>
                        <span className="text-gold-600 font-mono font-bold">$18.00</span>
                      </div>
                      <p className="text-gray-600 text-xs leading-relaxed mb-4 flex-grow">
                        Baasto talyaani ah oo lagu kariyay suugo hilib iyo khudaar is dhex jira oo caraf badan.
                      </p>
                      <div className="flex gap-2">
                        <span className="bg-slate-100 text-[9px] font-sans font-bold text-slate-500 px-2 py-0.5 rounded">PASTA</span>
                        <span className="bg-slate-100 text-[9px] font-sans font-bold text-slate-500 px-2 py-0.5 rounded">HALAL</span>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="bg-white rounded-md overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all p-6 flex flex-col group cursor-pointer" onClick={() => setCurrentTab('menu')}>
                      <div className="aspect-video overflow-hidden rounded mb-4 bg-gray-50">
                        <img
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoPed7BS6WR25zbgCAMHgjJ9kiu9szb3BvWv_GiWPPZXEb1vVKHzLFNlaOzj-MPmbYKrlqwO8Bp2FSuMbzItXtkstyyXoB-i9AL3OQ_59zvKsOwcIt2p0s7TmBTvzFie7JXVBWdUta_dLlm-GX4Ky1dzdbHuGrGDBOBYTzhN-pIg5BuOqQQDteqUB6ITKS_L-qpFOI5IRViGL4pTKZI2OGDgBoT9qrf3s28yBM8pa5nl4HOGp0LZCuq99JbZeVWieqZMg"
                          alt="Macmacaanka Baraa"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex justify-between items-baseline mb-2">
                        <h4 className="font-heading font-bold text-lg text-primary-900">Macmacaanka Baraa</h4>
                        <span className="text-gold-600 font-mono font-bold">$12.00</span>
                      </div>
                      <p className="text-gray-600 text-xs leading-relaxed mb-4 flex-grow">
                        Iskiriin qabow oo lagu daray shukulaato, kareem aad u macaan, iyo jalaato guri.
                      </p>
                      <div className="flex gap-2">
                        <span className="bg-slate-100 text-[9px] font-sans font-bold text-slate-500 px-2 py-0.5 rounded">DESSERT</span>
                        <span className="bg-slate-100 text-[9px] font-sans font-bold text-slate-500 px-2 py-0.5 rounded">SWEET</span>
                      </div>
                    </div>

                    {/* Item 3 */}
                    <div className="bg-white rounded-md overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all p-6 flex flex-col group cursor-pointer" onClick={() => setCurrentTab('menu')}>
                      <div className="aspect-video overflow-hidden rounded mb-4 bg-gray-50">
                        <img
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnm9dZgyrp0IzXmxx-uYBDzG_pREbJ2260ZC_MkTaOBshf45ju2isyFjhHljNuNa_t7wK0lOq6mcwv3tJtRNrCbUhZnykWLdKc7GmOKyQOnmvcCFL2WB9vEb1dq1bwWDypLV8p4ziwqnxWUEF4vjOAeDhkDKJPYNyQCxQyrKWdkEEKrLIebuJtd1uW7W_jMJjIVemBRxFrTYp8pDgAI9eeAjeIkB5ga6qxDuac4IglmJ8QzJ3zEJZm5r_PfxbTrfzQ6JA"
                          alt="Casiirka Mango"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex justify-between items-baseline mb-2">
                        <h4 className="font-heading font-bold text-lg text-primary-900">Casiirka Mango</h4>
                        <span className="text-gold-600 font-mono font-bold">$8.00</span>
                      </div>
                      <p className="text-gray-600 text-xs leading-relaxed mb-4 flex-grow">
                        Casiir dabiici ah oo laga soo miiqay Cambaha cusub ee dalkeena laga helo, aad u qabow.
                      </p>
                      <div className="flex gap-2">
                        <span className="bg-slate-100 text-[9px] font-sans font-bold text-slate-500 px-2 py-0.5 rounded">FRESH</span>
                        <span className="bg-slate-100 text-[9px] font-sans font-bold text-slate-500 px-2 py-0.5 rounded">FRUIT</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center mt-12">
                    <button
                      onClick={() => {
                        setCurrentTab('menu');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="bg-primary-900 hover:bg-primary-950 text-gold-400 px-8 py-3.5 rounded-sm text-xs font-sans font-bold tracking-widest hover:shadow-lg transition-all cursor-pointer"
                    >
                      FIIRI MENYADA OO DHAMMAAN
                    </button>
                  </div>

                </div>
              </section>

              {/* Booking CTA Section */}
              <section className="py-24 bg-primary-900 text-white relative overflow-hidden">
                <div className="absolute top-1/2 -left-12 -translate-y-1/2 opacity-5 text-white pointer-events-none">
                  <ChefHat className="w-[500px] h-[500px]" />
                </div>
                
                <div className="max-w-4xl mx-auto text-center px-6 relative z-10 space-y-6">
                  <span className="text-gold-400 font-sans font-bold text-xs tracking-[0.25em] uppercase block">
                    BALLAN-CEELIN ONLINE AH
                  </span>
                  <h3 className="text-3xl md:text-5xl font-display font-bold leading-tight max-w-2xl mx-auto">
                    Ma Doonaysaa Khibrad Cunto oo aan La Ilaawi Karin?
                  </h3>
                  <p className="text-gray-300 text-sm max-w-xl mx-auto leading-relaxed">
                    Si aad u xaqiijisato miiskaaga iyo cuntadaada, fadlan nagala soo xiriir khadka reservation-ka ama si toos ah uga ballanso foomkayaga online-ka ah.
                  </p>
                  
                  <div className="pt-6">
                    <button
                      onClick={() => {
                        setCurrentTab('book');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="bg-gold-500 hover:bg-gold-400 text-primary-950 px-10 py-4.5 rounded-sm text-xs font-sans font-bold tracking-widest hover:shadow-xl hover:shadow-gold-500/20 transition-all cursor-pointer"
                    >
                      HADDA BALLANSO MIISKAAGA
                    </button>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {currentTab === 'menu' && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <MenuShowcase onBookClick={() => setCurrentTab('book')} />
            </motion.div>
          )}

          {currentTab === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <AboutUs />
            </motion.div>
          )}

          {currentTab === 'book' && (
            <motion.div
              key="book"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <ReservationForm />
            </motion.div>
          )}

          {currentTab === 'reviews' && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <ReviewsSection />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Area */}
      <footer className="bg-primary-900 text-white border-t border-white/5 py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          
          {/* Logo & Intro */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 shadow-md shadow-gold-500/10">
                <BaraaLogo variant="badge" className="w-12 h-12" />
              </div>
              <h2 className="text-xl font-heading font-bold text-white tracking-tight">Baraa Restaurant</h2>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
              Halkii uu ku kulmi lahaa dhadhanka runta ah, hiddaha iyo dhaqanka Soomaaliyeed, iyo raaxada casriga ah.
            </p>
            <div className="flex items-center gap-2.5 pt-2 text-xs text-gray-400">
              <Globe className="w-4 h-4 text-gold-400" />
              <span>www.baraarestaurant.so</span>
            </div>

            {/* Social Media Section */}
            <div className="pt-4 space-y-3">
              <h4 className="text-[10px] font-sans font-bold text-gold-400 tracking-widest uppercase">
                Nagala Xiriir Baraha Bulshada
              </h4>
              <div className="flex items-center gap-3">
                <a
                  href="https://wa.me/252771909054"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition-all shadow-md hover:scale-110 group"
                  title="WhatsApp"
                >
                  <MessageCircle className="w-5 h-5 group-hover:animate-pulse" />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-gold-400/20 text-gray-300 hover:text-gold-400 flex items-center justify-center transition-all shadow-md hover:scale-110"
                  title="Facebook"
                >
                  <Facebook className="w-4.5 h-4.5" />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-gold-400/20 text-gray-300 hover:text-gold-400 flex items-center justify-center transition-all shadow-md hover:scale-110"
                  title="Instagram"
                >
                  <Instagram className="w-4.5 h-4.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-sans font-bold text-gold-400 tracking-widest uppercase">
              SAACADAHA SHAQADA
            </h4>
            <div className="space-y-2 text-xs text-gray-300">
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>Isniin - Axad</span>
                <span className="font-bold text-gold-400">7/24 (Furan 24 Saac)</span>
              </div>
            </div>
          </div>

          {/* Quick Contact & Address */}
          <div className="md:col-span-5 space-y-4">
            <h4 className="text-xs font-sans font-bold text-gold-400 tracking-widest uppercase">
              CIWAANKA &amp; XIRIIRKA
            </h4>
            <div className="space-y-3.5 text-xs text-gray-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-4.5 h-4.5 text-gold-400 shrink-0 mt-0.5" />
                <span>Waddada Maka Al-Mukarama, Muqdisho, Soomaaliya</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4.5 h-4.5 text-gold-400 shrink-0" />
                <a href="tel:+252771909054" className="hover:text-gold-400 transition-colors">+252 771909054</a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4.5 h-4.5 text-gold-400 shrink-0" />
                <a href="mailto:maankacom66@gmail.com" className="hover:text-gold-400 transition-colors">maankacom66@gmail.com</a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-gray-500 font-sans tracking-wider">
          <p>© 2026 Baraa Restaurant. All Rights Reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gold-400 transition-colors">PRIVACY POLICY</a>
            <a href="#" className="hover:text-gold-400 transition-colors">TERMS OF SERVICE</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
