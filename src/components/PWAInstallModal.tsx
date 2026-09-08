import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Smartphone, Monitor, Share2, PlusSquare, MoreVertical, X, Sparkles, CheckCircle2 } from 'lucide-react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  isIOS?: boolean;
}

export default function PWAInstallModal({ isOpen, onClose, isIOS = false }: PWAInstallModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-lg bg-primary-950 text-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-gold-500/30 overflow-hidden relative"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Xir"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3.5 mb-5 pr-8">
            <div className="w-12 h-12 rounded-2xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400 shrink-0">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/30">
                  BARAA PWA APP
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-heading font-bold text-white leading-snug">
                Sida Loo Shubto App-ka BARAA
              </h3>
            </div>
          </div>

          {/* Platform Instructions */}
          {isIOS ? (
            /* iOS Safari Instructions */
            <div className="space-y-3 bg-white/5 rounded-2xl p-4 sm:p-5 border border-white/10 text-xs sm:text-sm text-gray-200">
              <div className="font-semibold text-gold-300 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-gold-400" />
                <span>Tilmaamaha iPhone / iPad (Safari)</span>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gold-500 text-primary-950 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div className="leading-snug">
                  Riix batoonka <strong className="text-gold-300">Share</strong> (
                  <Share2 className="inline w-3.5 h-3.5 mx-1 text-gold-400" />
                  ) ee ku yaalla xagga hoose ama sare ee Safari.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gold-500 text-primary-950 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div className="leading-snug">
                  Hoos u yara dhaadhac oo dooro <strong className="text-gold-300">"Add to Home Screen"</strong> (
                  <PlusSquare className="inline w-3.5 h-3.5 mx-1 text-gold-400" />
                  ).
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gold-500 text-primary-950 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  3
                </div>
                <div className="leading-snug">
                  Guji <strong className="text-gold-300">"Add"</strong> ee xagga midigta sare si aad toos ugu darto shaashaddaada.
                </div>
              </div>
            </div>
          ) : (
            /* Android / Chrome / Windows / Mac Instructions */
            <div className="space-y-4">
              <div className="space-y-3 bg-white/5 rounded-2xl p-4 border border-white/10 text-xs sm:text-sm text-gray-200">
                <div className="font-semibold text-gold-300 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-gold-400" />
                  <span>Taleefannada Android / Google Chrome</span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gold-500 text-primary-950 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="leading-snug">
                    Riix saddexda dhibcood (<MoreVertical className="inline w-3.5 h-3.5 text-gold-400 mx-0.5" />) ee ku yaalla xagga sare ee browser-kaaga Chrome.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gold-500 text-primary-950 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="leading-snug">
                    Dooro <strong className="text-gold-300">"Install app"</strong> ama <strong className="text-gold-300">"Add to Home screen"</strong>.
                  </div>
                </div>
              </div>

              <div className="space-y-2 bg-white/5 rounded-2xl p-4 border border-white/10 text-xs sm:text-sm text-gray-200">
                <div className="font-semibold text-gold-300 flex items-center gap-1.5">
                  <Monitor className="w-4 h-4 text-gold-400" />
                  <span>Kombiyuutarka (Chrome / Edge PC / Mac)</span>
                </div>
                <p className="leading-relaxed text-gray-300">
                  Riix astaanta yar ee <strong className="text-gold-300">"Install BARAA RESTAURANT"</strong> ee ku taal bar-ka URL-ka (dhanka midig ee sare) si aad ugu shubato desktop-kaaga.
                </p>
              </div>
            </div>
          )}

          {/* Action button */}
          <button
            onClick={onClose}
            className="mt-5 w-full py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-primary-950 font-bold text-sm rounded-xl shadow-lg transition-all cursor-pointer"
          >
            Waan Fahmay (Xir)
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
