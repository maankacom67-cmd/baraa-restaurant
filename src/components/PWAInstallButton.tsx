import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import PWAInstallModal from './PWAInstallModal';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'nav' | 'hero' | 'card' | 'compact';
}

export default function PWAInstallButton({ className = '', variant = 'nav' }: PWAInstallButtonProps) {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // If already installed and launched as standalone app, hide button
  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      setIsInstalling(true);
      try {
        const success = await install();
        if (!success) {
          setShowGuideModal(true);
        }
      } catch {
        setShowGuideModal(true);
      } finally {
        setIsInstalling(false);
      }
    } else {
      setShowGuideModal(true);
    }
  };

  if (variant === 'hero') {
    return (
      <>
        <button
          onClick={handleClick}
          disabled={isInstalling}
          className={`inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 text-primary-950 shadow-lg hover:shadow-gold-500/30 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer font-sans border border-gold-300 ${className}`}
        >
          <Download className="w-5 h-5 shrink-0" />
          <span>{isInstalling ? 'Fadlan sug...' : 'Shub App-ka BARAA RESTAURANT'}</span>
        </button>

        <PWAInstallModal
          isOpen={showGuideModal}
          onClose={() => setShowGuideModal(false)}
          isIOS={isIOS}
        />
      </>
    );
  }

  // Compact / Nav style
  return (
    <>
      <button
        onClick={handleClick}
        disabled={isInstalling}
        title="Shub App-ka BARAA RESTAURANT"
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gold-500/20 text-gold-300 border border-gold-500/40 hover:bg-gold-500 hover:text-primary-950 transition-all cursor-pointer ${className}`}
      >
        <Download className="w-3.5 h-3.5 shrink-0" />
        <span className="hidden sm:inline">Shub App-ka</span>
      </button>

      <PWAInstallModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
        isIOS={isIOS}
      />
    </>
  );
}
