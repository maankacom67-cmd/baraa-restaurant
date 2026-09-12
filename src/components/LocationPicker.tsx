import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, CheckCircle2, AlertCircle, RefreshCw, ExternalLink, Compass, ShieldCheck } from 'lucide-react';

export interface LocationPickerValue {
  locationLink: string;
  coords: { lat: number; lng: number } | null;
  addressText: string;
  accuracy?: number;
}

interface LocationPickerProps {
  locationLink: string;
  coords?: { lat: number; lng: number } | null;
  addressText: string;
  onChange: (value: {
    locationLink: string;
    coords: { lat: number; lng: number } | null;
    addressText: string;
    accuracy?: number;
  }) => void;
  required?: boolean;
  disabled?: boolean;
  autoRequest?: boolean;
}

export default function LocationPicker({
  locationLink,
  coords,
  addressText,
  onChange,
  required = true,
  disabled = false,
  autoRequest = true,
}: LocationPickerProps) {
  const [isLocating, setIsLocating] = useState(false);
  const [permissionState, setPermissionState] = useState<'idle' | 'locating' | 'granted' | 'denied' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [detectedPlace, setDetectedPlace] = useState<string>('');
  const hasAutoRequested = useRef(false);

  // Sync state if already has coordinates
  useEffect(() => {
    if (coords && locationLink) {
      setPermissionState('granted');
    }
  }, [coords, locationLink]);

  // Automatically request GPS position when component mounts (when customer starts ordering)
  useEffect(() => {
    if (autoRequest && !coords && !locationLink && !hasAutoRequested.current && !disabled) {
      hasAutoRequested.current = true;
      requestCurrentLocation();
    }
  }, [autoRequest, coords, locationLink, disabled]);

  const fetchPlaceName = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
        {
          headers: {
            'Accept-Language': 'so,en',
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (data && data.address) {
          const parts = [
            data.address.suburb || data.address.neighbourhood || data.address.road,
            data.address.city || data.address.town || data.address.county || 'Mogadishu',
          ].filter(Boolean);
          if (parts.length > 0) {
            const place = parts.join(', ');
            setDetectedPlace(place);
            return place;
          }
        }
      }
    } catch {
      // Non-critical fallback
    }
    return '';
  };

  const requestCurrentLocation = () => {
    if (disabled) return;

    if (!('geolocation' in navigator)) {
      setPermissionState('error');
      setErrorMessage('Aaladdaada ama browser-kaan ma taageerayo GPS Location. Fadlan gacanta ku qor ciwaankaaga.');
      return;
    }

    setIsLocating(true);
    setPermissionState('locating');
    setErrorMessage('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setIsLocating(false);
        const lat = Number(position.coords.latitude.toFixed(6));
        const lng = Number(position.coords.longitude.toFixed(6));
        const acc = Math.round(position.coords.accuracy || 0);
        setAccuracy(acc);

        const generatedLink = `https://maps.google.com/?q=${lat},${lng}`;
        setPermissionState('granted');
        setErrorMessage('');

        // Try getting friendly location name
        const place = await fetchPlaceName(lat, lng);
        const bestAddress = addressText || place || `Muqdisho (GPS: ${lat}, ${lng})`;

        onChange({
          locationLink: generatedLink,
          coords: { lat, lng },
          addressText: bestAddress,
          accuracy: acc,
        });
      },
      (error) => {
        setIsLocating(false);
        setPermissionState('denied');

        if (error.code === error.PERMISSION_DENIED) {
          setErrorMessage(
            'Waxaad diiday fasaxa Location-ka (GPS). Maqaayaddu waxay u baahan tahay meesha aad hadda joogto si cuntada toos laguguugu keeno.'
          );
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setErrorMessage(
            'GPS-kaaga lama heli karin. Fadlan hubi in Location/GPS-ka taleefankaagu shidan yahay, kadibna dib u tijaabi.'
          );
        } else if (error.code === error.TIMEOUT) {
          setErrorMessage('Waqtigii raadinta GPS-ka wuu dhacay. Fadlan riix badanka si aad dib ugu tijaabiso.');
        } else {
          setErrorMessage('Khalad ayaa dhacay xilliga raadinta Location-ka. Fadlan isku day mar kale.');
        }
      },
      {
        enableHighAccuracy: true, // Guarantees highest physical GPS accuracy from real device
        timeout: 15000,
        maximumAge: 0, // Never use stale/cached coordinates, always take current real location
      }
    );
  };

  const handleAddressTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    const fallbackLink = coords
      ? locationLink
      : newText.trim()
      ? `https://maps.google.com/?q=${encodeURIComponent(newText.trim() + ', Mogadishu, Somalia')}`
      : '';

    onChange({
      locationLink: coords ? locationLink : fallbackLink,
      coords: coords || null,
      addressText: newText,
      accuracy: accuracy || undefined,
    });
  };

  const resetLocation = () => {
    setPermissionState('idle');
    setErrorMessage('');
    setAccuracy(null);
    setDetectedPlace('');
    onChange({
      locationLink: '',
      coords: null,
      addressText: addressText || '',
    });
    // Re-request fresh
    setTimeout(() => {
      requestCurrentLocation();
    }, 100);
  };

  return (
    <div className="space-y-3" id="location-picker-container">
      {/* Header */}
      <div className="flex items-center justify-between">
        <label className="block text-[11px] font-sans font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-gold-600 animate-pulse" />
          <span>Goobtaada Saxda ah (Meesha aad hadda joogto) {required ? '*' : ''}</span>
        </label>
        {coords && (
          <span className="text-[10px] font-mono text-emerald-800 font-bold bg-emerald-100/90 px-2 py-0.5 rounded border border-emerald-300 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Goobta waa la qabtay
          </span>
        )}
      </div>

      {/* State 1: Locating in progress */}
      {isLocating && (
        <div className="p-3.5 bg-gold-50/80 border border-gold-300 rounded-lg flex items-center gap-3 animate-pulse">
          <RefreshCw className="w-5 h-5 text-gold-600 animate-spin shrink-0" />
          <div className="text-xs text-gold-950">
            <p className="font-bold">Raadinaya meesha aad joogto (GPS)...</p>
            <p className="text-[11px] text-gold-800">Fadlan ogolow haddii browser-ku ku weydiiyo fasax (Allow Location).</p>
          </div>
        </div>
      )}

      {/* State 2: Location Granted with exact coords */}
      {permissionState === 'granted' && coords && !isLocating && (
        <div className="p-3.5 bg-emerald-50 border-2 border-emerald-400/80 rounded-lg space-y-2.5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-900 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Meesha aad joogto waa la sugay (GPS Live)</span>
            </div>
            <button
              type="button"
              onClick={resetLocation}
              className="text-[10px] font-semibold text-emerald-800 hover:text-emerald-950 underline flex items-center gap-1 cursor-pointer"
              title="Cusboonaysii GPS-ka"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Dib u cusboonaysii</span>
            </button>
          </div>

          <div className="bg-white/95 p-2.5 rounded border border-emerald-200 text-xs space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] text-slate-600 font-medium">Coordinates:</span>
              <span className="font-mono text-[11px] font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                📍 {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
              </span>
            </div>

            {accuracy !== null && (
              <div className="flex items-center justify-between gap-2 text-[10px] text-slate-500">
                <span>Saxnaanta GPS (Accuracy):</span>
                <span className="font-semibold text-emerald-700">±{accuracy} mitir meeshaada</span>
              </div>
            )}

            {detectedPlace && (
              <div className="flex items-center justify-between gap-2 text-[11px] text-slate-700 pt-0.5 border-t border-slate-100">
                <span className="text-slate-500 text-[10px]">Agagaarka:</span>
                <span className="font-semibold text-slate-900 truncate max-w-[220px] sm:max-w-[300px]">
                  {detectedPlace}
                </span>
              </div>
            )}

            <div className="pt-1 flex items-center justify-between border-t border-slate-100">
              <span className="text-[10px] text-slate-500 font-medium">Link-ga Telegram loo dirayo:</span>
              <a
                href={locationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-bold text-gold-700 hover:text-gold-900 underline flex items-center gap-1"
              >
                <span>Fur Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* State 3: Denied or error - Prompts customer clearly to enable */}
      {permissionState === 'denied' && !isLocating && (
        <div className="p-3.5 bg-rose-50 border-2 border-rose-300 rounded-lg space-y-3 animate-in fade-in duration-200">
          <div className="flex items-start gap-2.5 text-rose-900 text-xs">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-rose-950 text-sm">Fadlan Ogolow Location-kaaga!</p>
              <p className="text-[11px] text-rose-800 mt-0.5">{errorMessage}</p>
            </div>
          </div>

          <div className="bg-white p-2.5 rounded border border-rose-200 text-[11px] text-slate-700 space-y-1">
            <p className="font-bold text-slate-900 flex items-center gap-1">
              <span>💡</span> <span>Sidee loo ogolaadaa?</span>
            </p>
            <ol className="list-decimal list-inside text-[10.5px] text-slate-600 space-y-0.5">
              <li>Riix badanka <strong>"Ogolow Location-kaaga"</strong> ee hoose.</li>
              <li>Marka uu browser-ku ku weydiiyo, dooro <strong>"Allow" ama "Ogolow"</strong>.</li>
              <li>Haddii uu xiran yahay, taabo calaamadda qufulka 🔒 ee xagga sare ee browser-ka si aad u fasaxdo.</li>
            </ol>
          </div>

          <button
            type="button"
            onClick={requestCurrentLocation}
            className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 active:scale-[0.99] text-white rounded-md text-xs font-bold tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow"
          >
            <Navigation className="w-4 h-4" />
            <span>📍 Ogolow Location-kaaga (Isku day mar kale)</span>
          </button>
        </div>
      )}

      {/* State 4: Idle (not yet prompted or waiting) */}
      {permissionState === 'idle' && !isLocating && (
        <div className="p-3 bg-slate-50 border border-slate-300 rounded-lg space-y-2">
          <p className="text-[11px] text-slate-700 leading-snug">
            Waxaan u baahanahay <strong>meesha aad hadda joogto (GPS)</strong> si cuntada toos looguugu keeno goobtaada saxda ah:
          </p>

          <button
            type="button"
            onClick={requestCurrentLocation}
            disabled={disabled}
            className="w-full py-2.5 px-4 bg-primary-900 hover:bg-primary-950 text-gold-400 rounded-md text-xs font-sans font-bold tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-[0.99]"
          >
            <Navigation className="w-4 h-4 text-gold-400" />
            <span>📍 Soo qaad Meesha aan Joogo (GPS Link)</span>
          </button>
        </div>
      )}

      {/* Complementary Address Input */}
      <div>
        <label className="block text-[10.5px] font-sans font-semibold text-slate-600 mb-1" htmlFor="location-address-text">
          {coords
            ? 'Faahfaahin dheeri ah (Guri lambar, Xaafad, ama meel caan ah oo kuu dhow):'
            : 'Ama qor Xaafadda / Meesha aad joogto gacanta:'}
        </label>
        <div className="relative">
          <input
            id="location-address-text"
            type="text"
            value={addressText}
            onChange={handleAddressTextChange}
            placeholder={
              coords
                ? 'Tusaale: Guri #14, ka soo horjeedka Masjidka...'
                : 'Tusaale: Degmada Hodan, agagaarka Taleex, Muqdisho'
            }
            className="w-full bg-slate-50 text-xs p-2.5 pr-8 rounded border border-gray-200 focus:outline-none focus:border-gold-500 transition-colors"
          />
          <Compass className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
