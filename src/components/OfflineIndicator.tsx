import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export default function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-amber-600 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg flex items-center gap-2 border border-amber-400/40 animate-pulse"
    >
      <WifiOff className="w-3.5 h-3.5" />
      <span>Habka Khadla'aanta (Offline) — Menu-ga kaydsan ayaa lagu tusiyaa</span>
    </div>
  );
}
