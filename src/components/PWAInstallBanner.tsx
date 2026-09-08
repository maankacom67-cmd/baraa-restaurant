import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, X, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import PWAInstallModal from './PWAInstallModal';

export default function PWAInstallBanner() {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [isDismissed, setIsDismissed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [autoShowTimer, setAutoShowTimer] = useState(false);

  // Check if previously dismissed in this session
  useEffect(() => {
    const dismissed = sessionStorage.getItem('pwa_banner_dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }

    // Auto show banner after 2.5s if not installed and not dismissed
    const timer = setTimeout(() => {
      setAutoShowTimer(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('pwa_banner_dismissed', 'true');
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      setIsInstalling(true);
      try {
        const success = await install();
        if (success) {
          setIsDismissed(true);
        } else {
          setShowModal(true);
        }
      } catch {
        setShowModal(true);
      } finally {
        setIsInstalling(false);
      }
    } else {
      setShowModal(true);
    }
  };

  // If already installed as standalone app or manually dismissed, do not show
  if (isInstalled || isDismissed) {
    return (
      <PWAInstallModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        isIOS={isIOS}
      />
    );
  }

  // Show if beforeinstallprompt fired, or on iOS, or after 2.5s timer
  const shouldShow = isInstallable || isIOS || autoShowTimer;

  if (!shouldShow) {
    return null;
  }

  return (
    <>
      <AnimatePresence>
        <motion.aside
          aria-label="Ku shub App-ka BARAA RESTAURANT"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-50 pointer-events-auto"
        >
          <div className="bg-gradient-to-r from-primary-950 via-primary-900 to-primary-950 text-white rounded-2xl p-4 sm:p-5 shadow-2xl border border-gold-500/30 backdrop-blur-xl relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Xir ogeysiiska"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-3.5 pr-6">
              {/* Logo / App Icon */}
              <div className="relative shrink-0">
                <img
                  src="/favicon-192x192.png"
                  alt="BARAA RESTAURANT Logo"
                  className="w-12 h-12 rounded-xl object-cover border border-gold-400/40 shadow-md bg-primary-950"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute -bottom-1 -right-1 bg-gold-500 text-primary-950 rounded-full p-0.5 shadow">
                  <Sparkles className="w-3 h-3" />
                </div>
              </div>

              {/* Text Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/30">
                    PWA App
                  </span>
                  <span className="text-xs text-gray-300 font-medium">Bilaash &amp; Degdeg</span>
                </div>
                <h4 className="text-sm sm:text-base font-heading font-bold text-white leading-tight">
                  Shub App-ka BARAA RESTAURANT
                </h4>
                <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                  Toos ugu shubo shaashadda taleefankaaga si aad cunto ugu dalbato adoon browser furin!
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center gap-2">
              <button
                onClick={handleInstallClick}
                disabled={isInstalling}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-primary-950 font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-lg hover:shadow-gold-500/30 active:scale-95 transition-all cursor-pointer font-sans"
              >
                <Download className="w-4 h-4 shrink-0" />
                <span>{isInstalling ? 'Fadlan sug...' : 'Shub App-ka BARAA RESTAURANT'}</span>
              </button>

              <button
                onClick={handleDismiss}
                className="px-3 py-2.5 text-xs text-gray-300 hover:text-white rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
              >
                Hadhow
              </button>
            </div>
          </div>
        </motion.aside>
      </AnimatePresence>

      {/* Guided Install Modal */}
      <PWAInstallModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        isIOS={isIOS}
      />
    </>
  );
}
