import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, Navigation, CheckCircle2, AlertCircle, RefreshCw, X, 
  HelpCircle, Compass, ChevronRight, ExternalLink, Info 
} from 'lucide-react';
import { 
  getStoredGpsCoords, 
  saveGpsCoords, 
  formatGpsLink, 
  requestGpsLocation, 
  silentCheckGps,
  MOGADISHU_DISTRICTS,
  DistrictPreset,
  GpsCoordinates,
  matchMogadishuDistrict
} from '../lib/gps';

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
  onChange: (value: LocationPickerValue) => void;
  required?: boolean;
  disabled?: boolean;
  autoRequest?: boolean;
  placeholder?: string;
  label?: string;
}

export default function LocationPicker({
  locationLink,
  coords,
  addressText,
  onChange,
  required = true,
  disabled = false,
  autoRequest = true,
  placeholder = 'Qor ciwaankaaga (Tusaale: Macaane, Hodan, KM4...)',
  label = 'Goobtaada / Ciwaanka (Delivery Address)',
}: LocationPickerProps) {
  const [isLocating, setIsLocating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPermissionGuide, setShowPermissionGuide] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedDistrictName, setSelectedDistrictName] = useState<string>('');
  const hasAutoChecked = useRef(false);

  // Synchronize with stored coordinates and listen to global GPS updates
  useEffect(() => {
    // 1. If no coords yet in props, check stored GPS
    if (!coords) {
      const stored = getStoredGpsCoords();
      if (stored && stored.lat && stored.lng) {
        onChange({
          locationLink: formatGpsLink(stored),
          coords: { lat: stored.lat, lng: stored.lng },
          addressText: addressText || '',
          accuracy: stored.accuracy,
        });
        return;
      }
    }

    // 2. Listen to background/global GPS updates
    const handleGpsUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<GpsCoordinates>;
      if (customEvent.detail && customEvent.detail.lat && customEvent.detail.lng) {
        onChange({
          locationLink: formatGpsLink(customEvent.detail),
          coords: { lat: customEvent.detail.lat, lng: customEvent.detail.lng },
          addressText: addressText || '',
          accuracy: customEvent.detail.accuracy,
        });
      }
    };

    window.addEventListener('baraa_gps_updated', handleGpsUpdate);

    // 3. Silent auto-check: Only query if permission is ALREADY granted to prevent scaring user with errors
    if (autoRequest && !coords && !disabled && !hasAutoChecked.current) {
      hasAutoChecked.current = true;
      silentCheckGps().then((detected) => {
        if (detected) {
          onChange({
            locationLink: formatGpsLink(detected),
            coords: { lat: detected.lat, lng: detected.lng },
            addressText: addressText || '',
            accuracy: detected.accuracy,
          });
        }
      }).catch(() => {
        // Silently ignore background check failures on mount
      });
    }

    return () => {
      window.removeEventListener('baraa_gps_updated', handleGpsUpdate);
    };
  }, [coords, disabled, autoRequest]);

  // Explicit user-triggered GPS request
  const triggerGpsRequest = async () => {
    if (disabled || isLocating) return;

    setIsLocating(true);
    setErrorMessage('');

    try {
      const detected = await requestGpsLocation();
      setIsLocating(false);
      setErrorMessage('');
      setSelectedDistrictName('');

      onChange({
        locationLink: formatGpsLink(detected),
        coords: { lat: detected.lat, lng: detected.lng },
        addressText: addressText.trim() ? addressText : 'Goobta tooska ah ee GPS-ka (Muqdisho)',
        accuracy: detected.accuracy,
      });
    } catch (err: any) {
      setIsLocating(false);
      
      // Auto-fallback: If user already typed or selected a Mogadishu area, use its coords smoothly
      const matched = matchMogadishuDistrict(addressText);
      if (matched) {
        const coordsObj = { lat: matched.lat, lng: matched.lng };
        saveGpsCoords(coordsObj);
        setSelectedDistrictName(matched.name);
        onChange({
          locationLink: formatGpsLink(coordsObj),
          coords: coordsObj,
          addressText: addressText,
          accuracy: 50,
        });
        setErrorMessage('');
      } else {
        if (err?.code === 1) { // PERMISSION_DENIED
          setErrorMessage('Fasaxa GPS-ka biraawsarka waa la diiday. Dooro xaafaddaada hoose ama qor ciwaanka.');
        } else if (err?.code === 2) { // POSITION_UNAVAILABLE
          setErrorMessage('GPS-ka lama heli karin hadda. Dooro xaafaddaada hoos ama qor ciwaanka.');
        } else {
          setErrorMessage('GPS-ka taleefanka lama helin. Dooro xaafaddaada hoose ama qor ciwaanka.');
        }
      }
    }
  };

  const handleAddressTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;

    // Check if user has active GPS sensor coordinates
    let activeCoords = coords || getStoredGpsCoords();

    // If no hardware GPS sensor active, match district name from typed text automatically
    const matched = !activeCoords ? matchMogadishuDistrict(newText) : null;
    if (matched) {
      activeCoords = { lat: matched.lat, lng: matched.lng };
      setSelectedDistrictName(matched.name);
      setErrorMessage('');
    }

    const gpsLink = activeCoords && activeCoords.lat && activeCoords.lng 
      ? formatGpsLink(activeCoords) 
      : (newText ? `https://maps.google.com/?q=${encodeURIComponent(newText + ', Mogadishu, Somalia')}` : '');

    onChange({
      locationLink: gpsLink,
      coords: activeCoords ? { lat: activeCoords.lat, lng: activeCoords.lng } : null,
      addressText: newText,
    });
  };

  const handleSelectDistrict = (district: DistrictPreset) => {
    setSelectedDistrictName(district.name);
    setErrorMessage('');

    const coordsObj = { lat: district.lat, lng: district.lng };
    saveGpsCoords(coordsObj);

    // Keep user's custom details if they already typed something specific, or formulate clean address
    const newAddress = addressText.trim() && !addressText.toLowerCase().includes(district.name.toLowerCase())
      ? `${district.name}, ${addressText.trim()}`
      : `${district.name}, ${district.subTitle}, Muqdisho`;

    onChange({
      locationLink: formatGpsLink(coordsObj),
      coords: coordsObj,
      addressText: newAddress,
      accuracy: 50,
    });
  };

  const clearGPS = () => {
    setErrorMessage('');
    setSelectedDistrictName('');
    try {
      localStorage.removeItem('baraa_saved_gps_location');
      sessionStorage.removeItem('baraa_saved_gps_location');
      if (window.__BARAA_GPS_COORDS__) {
        window.__BARAA_GPS_COORDS__ = null;
      }
    } catch {}

    onChange({
      locationLink: addressText ? `https://maps.google.com/?q=${encodeURIComponent(addressText + ', Mogadishu, Somalia')}` : '',
      coords: null,
      addressText: addressText || '',
    });
  };

  const hasCoords = Boolean(coords && coords.lat && coords.lng);

  return (
    <div className="space-y-2" id="compact-location-picker">
      {/* Sleek Label & Status Header */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1.5" htmlFor="location-address-input">
          <MapPin className="w-3.5 h-3.5 text-gold-600" />
          <span>{label} {required ? '*' : ''}</span>
        </label>
        {hasCoords ? (
          <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> GPS Diyaar ah
          </span>
        ) : (
          <span className="text-[10px] text-slate-400 font-sans">
            Muqdisho & nawaaxigeeda
          </span>
        )}
      </div>

      {/* Input Field with Small Embedded GPS Icon Button */}
      <div className="relative flex items-center">
        <input
          id="location-address-input"
          type="text"
          value={addressText}
          onChange={handleAddressTextChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className="w-full pl-3.5 pr-28 py-2.5 bg-slate-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
        />

        {/* Action Button: GPS request */}
        <button
          type="button"
          onClick={triggerGpsRequest}
          disabled={disabled || isLocating}
          title={hasCoords ? "GPS waa la qabtay. Riix si aad mar kale u cusboonaysiiso." : "Riix si aad GPS toos ugu qaadato"}
          className={`absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
            hasCoords
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100 shadow-xs'
              : isLocating
              ? 'bg-gold-50 text-gold-800 border-gold-300 animate-pulse'
              : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-gold-400 shadow-xs'
          }`}
        >
          {isLocating ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-gold-600" />
          ) : hasCoords ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <Navigation className="w-3.5 h-3.5 text-gold-600" />
          )}
          <span className="text-[11px] font-bold">
            {isLocating ? 'Raadin...' : hasCoords ? 'GPS ✓' : 'GPS'}
          </span>
        </button>
      </div>

      {/* Quick Mogadishu Neighborhood Chips (One-Tap Selection) */}
      <div className="space-y-1 pt-0.5">
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-sans">
          <span className="flex items-center gap-1 font-medium">
            <Compass className="w-3 h-3 text-gold-600" /> Dooro Xaafaddaada degdeg:
          </span>
          <button
            type="button"
            onClick={() => setShowMapModal(true)}
            className="text-[10px] text-gold-700 font-bold hover:text-gold-900 underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>Khariidadda</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
          {MOGADISHU_DISTRICTS.slice(0, 7).map((d) => (
            <button
              key={d.name}
              type="button"
              onClick={() => handleSelectDistrict(d)}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-all border text-[11px] font-medium cursor-pointer ${
                selectedDistrictName === d.name || addressText.toLowerCase().includes(d.name.toLowerCase())
                  ? 'bg-gold-500 text-primary-950 border-gold-600 font-bold shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-gold-400 hover:bg-slate-50'
              }`}
            >
              📍 {d.name}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setShowMapModal(true)}
            className="px-2 py-1 rounded-full whitespace-nowrap bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 text-[11px] font-medium cursor-pointer"
          >
            + Xaafado kale
          </button>
        </div>
      </div>

      {/* Active GPS status banner OR Friendly Permission Guidance */}
      {hasCoords ? (
        <div className="flex items-center justify-between text-[11px] text-emerald-800 bg-emerald-50/80 border border-emerald-200 rounded px-2.5 py-1.5">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Goobtaada GPS waa la qabtay si toos ah (Google Maps diyaar ah)</span>
          </span>
          <button
            type="button"
            onClick={clearGPS}
            className="text-slate-400 hover:text-rose-600 flex items-center gap-0.5 cursor-pointer transition-colors text-[10px]"
            title="Ka saar GPS-ka"
          >
            <X className="w-3 h-3" />
            <span>Tir</span>
          </button>
        </div>
      ) : errorMessage ? (
        <div className="p-2.5 bg-amber-50/90 border border-amber-200 rounded-md text-amber-900 text-xs space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">{errorMessage}</p>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage('')}
              className="text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-3 pt-1 border-t border-amber-200/60 text-[11px]">
            <button
              type="button"
              onClick={() => setShowPermissionGuide(true)}
              className="font-bold text-gold-800 hover:text-gold-950 underline flex items-center gap-1 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" /> Sida loo ogolaado GPS-ka
            </button>
            <button
              type="button"
              onClick={triggerGpsRequest}
              className="font-bold text-amber-900 hover:text-amber-950 underline cursor-pointer"
            >
              Isku day mar kale
            </button>
          </div>
        </div>
      ) : null}

      {/* Chrome Permission Modal / Helper */}
      {showPermissionGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-2xl border border-gold-500/20 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h4 className="text-sm font-bold text-primary-950 flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-gold-600" /> Sida loo shido GPS-ka Chrome-ka
              </h4>
              <button
                type="button"
                onClick={() => setShowPermissionGuide(false)}
                className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
              <div className="flex gap-2.5 items-start">
                <span className="w-5 h-5 rounded-full bg-gold-100 text-gold-800 font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                <p>Taabo calaamadda <strong>🔒 Qufulka</strong> ama astaanta goobta ee ku taal bar-ka sare ee Chrome (URL-ka agtiisa).</p>
              </div>

              <div className="flex gap-2.5 items-start">
                <span className="w-5 h-5 rounded-full bg-gold-100 text-gold-800 font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                <p>Guji <strong>Permissions (Fasaxyada)</strong> kadibna dooro <strong>Location (Goobta)</strong>.</p>
              </div>

              <div className="flex gap-2.5 items-start">
                <span className="w-5 h-5 rounded-full bg-gold-100 text-gold-800 font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                <p>Ka dhig <strong>Allow (Ogolow)</strong> si biraawsarku u ogaado meesha aad joogto.</p>
              </div>

              <div className="flex gap-2.5 items-start">
                <span className="w-5 h-5 rounded-full bg-gold-100 text-gold-800 font-bold flex items-center justify-center shrink-0 text-[11px]">4</span>
                <p>Halkaan ku soo laabo oo riix batoonka <strong>"Isku day mar kale"</strong>.</p>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-600 flex items-center gap-2">
                <Info className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Haddii aadan rabin inaad GPS shiddo, wax dhib ah ma leh: kaliya qor ciwaankaaga ama dooro xaafadaha hoose.</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowPermissionGuide(false);
                  triggerGpsRequest();
                }}
                className="flex-1 py-2 px-3 bg-gold-500 hover:bg-gold-600 text-primary-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Isku day mar kale
              </button>
              <button
                type="button"
                onClick={() => setShowPermissionGuide(false)}
                className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-lg transition-colors cursor-pointer"
              >
                Waan fahmay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Extended Mogadishu Neighborhood / Map Selector Modal */}
      {showMapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-2xl border border-gold-500/20 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h4 className="text-sm font-bold text-primary-950 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-gold-600" /> Dooro Xaafaddaada Muqdisho
              </h4>
              <button
                type="button"
                onClick={() => setShowMapModal(false)}
                className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Guji meesha aad joogto si loogu hagaajiyo khariidadda GPS-ka tooska ah:
            </p>

            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 divide-y divide-slate-100">
              {MOGADISHU_DISTRICTS.map((d) => (
                <button
                  key={d.name}
                  type="button"
                  onClick={() => {
                    handleSelectDistrict(d);
                    setShowMapModal(false);
                  }}
                  className="w-full py-2.5 px-3 rounded-lg text-left hover:bg-gold-50/70 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-gold-100 text-gold-800 flex items-center justify-center group-hover:bg-gold-500 group-hover:text-primary-950 transition-colors">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-primary-950">{d.name}</p>
                      <p className="text-[10px] text-slate-500">{d.subTitle}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono group-hover:text-gold-700">
                    Dooro →
                  </span>
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowMapModal(false)}
                className="py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Xidh
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
