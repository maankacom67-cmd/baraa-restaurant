export interface GpsCoordinates {
  lat: number;
  lng: number;
  accuracy?: number;
  districtName?: string;
}

export interface DistrictPreset {
  name: string;
  subTitle: string;
  lat: number;
  lng: number;
  aliases: string[];
}

export const MOGADISHU_DISTRICTS: DistrictPreset[] = [
  { name: 'Taleex', subTitle: 'Hodan', lat: 2.0435, lng: 45.3115, aliases: ['taleex', 'talex', 'taleex hodan'] },
  { name: 'KM4', subTitle: 'Hodan / Tarbuunka', lat: 2.0470, lng: 45.3180, aliases: ['km4', 'km 4', 'afar', 'isgoyska km4', 'km-4'] },
  { name: 'Hodan', subTitle: 'Degmada Hodan', lat: 2.0510, lng: 45.3130, aliases: ['hodan', 'degmada hodan'] },
  { name: 'Macaane', subTitle: 'Waberi / Madaxtooyada', lat: 2.0410, lng: 45.3410, aliases: ['macaane', 'macane', 'macaan'] },
  { name: 'Banaadir', subTitle: 'Hodan / Digfeer', lat: 2.0520, lng: 45.3050, aliases: ['banaadir', 'banadir', 'digfeer', 'digfeer hospital', 'isbitaalka digfeer'] },
  { name: 'Bakaaro', subTitle: 'Howlwadaag / Suuqa Weyn', lat: 2.0450, lng: 45.3300, aliases: ['bakaaro', 'bakaro', 'bakaaraha', 'howlwadaag', 'hawlwadaag'] },
  { name: 'Waberi', subTitle: 'Garoonka Diyaaradaha', lat: 2.0280, lng: 45.3210, aliases: ['waberi', 'waaberi', '21 oktoobar', '21 october'] },
  { name: 'Wadajir', subTitle: 'Medina / Buulo Xuubey', lat: 2.0250, lng: 45.2850, aliases: ['wadajir', 'madiina', 'medina', 'buulo xuubey', 'buulo xubeey', 'danwadaag'] },
  { name: 'Xamar Weyne', subTitle: 'Magaalada Hore & Dekedda', lat: 2.0350, lng: 45.3440, aliases: ['xamar weyne', 'xamarweyne', 'xamar weyn', 'hamarweyne'] },
  { name: 'Liido', subTitle: 'Xeebta Liido & Cabdicasiis', lat: 2.0480, lng: 45.3620, aliases: ['liido', 'lido', 'xeebta liido', 'cabdicasiis', 'abdicasiis'] },
  { name: 'KM5 / Zobe', subTitle: 'Zoobe / Isgoyska Zobe', lat: 2.0495, lng: 45.3140, aliases: ['zobe', 'zoobe', 'km5', 'km 5'] },
  { name: 'Dayniile', subTitle: 'Cisbitaalka Dayniile', lat: 2.0710, lng: 45.2750, aliases: ['dayniile', 'daynile', 'daniile'] },
  { name: 'Yaaqshiid', subTitle: 'Fagax & Tawakal', lat: 2.0650, lng: 45.3450, aliases: ['yaaqshiid', 'yaqshid', 'fagax', 'tawakal'] },
  { name: 'Karaan', subTitle: 'Shibis & Karaan', lat: 2.0580, lng: 45.3720, aliases: ['karaan', 'karan', 'shibis'] },
  { name: 'Dharkeynley', subTitle: 'Dabaqa & Oodweyne', lat: 2.0180, lng: 45.2670, aliases: ['dharkeynley', 'dharkenley', 'dharkaynley'] },
  { name: 'Boondheere', subTitle: 'Daljirka Dahson', lat: 2.0460, lng: 45.3420, aliases: ['boondheere', 'bondhere', 'daljirka'] },
  { name: 'Xamar Jajab', subTitle: 'Dekedda Weyn ee Muqdisho', lat: 2.0290, lng: 45.3350, aliases: ['xamar jajab', 'xamarjajab', 'dekedda'] },
  { name: 'Kaxda', subTitle: 'Dagmada Kaxda', lat: 2.0220, lng: 45.2420, aliases: ['kaxda', 'kahda'] },
  { name: 'Huriwaa / Hilwaa', subTitle: 'Sos & Suuqa Xoolaha', lat: 2.0780, lng: 45.3520, aliases: ['huriwaa', 'hilwaa', 'suuqa xoolaha', 'sos'] },
  { name: 'Maka Al-Mukarama', subTitle: 'Waddada Wadnaha', lat: 2.0425, lng: 45.3260, aliases: ['maka al-mukarama', 'maka almukarama', 'maka', 'makka'] },
];

const STORAGE_KEY = 'baraa_saved_gps_location';

declare global {
  interface Window {
    __BARAA_GPS_COORDS__?: GpsCoordinates | null;
  }
}

/**
 * Match a typed address string against known Mogadishu districts
 */
export function matchMogadishuDistrict(text: string): DistrictPreset | null {
  if (!text || typeof text !== 'string') return null;
  const clean = text.toLowerCase().trim();

  // 1. Direct or alias match
  for (const d of MOGADISHU_DISTRICTS) {
    if (clean.includes(d.name.toLowerCase())) {
      return d;
    }
    for (const alias of d.aliases) {
      if (clean.includes(alias)) {
        return d;
      }
    }
  }

  return null;
}

/**
 * Retrieve stored GPS coordinates from memory, localStorage, or sessionStorage
 */
export function getStoredGpsCoords(): GpsCoordinates | null {
  if (typeof window === 'undefined') return null;

  // 1. Check in-memory global
  if (window.__BARAA_GPS_COORDS__ && window.__BARAA_GPS_COORDS__.lat && window.__BARAA_GPS_COORDS__.lng) {
    return window.__BARAA_GPS_COORDS__;
  }

  // 2. Check localStorage
  try {
    const local = localStorage.getItem(STORAGE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      const coords = parsed.coords || parsed;
      if (coords && coords.lat && coords.lng) {
        window.__BARAA_GPS_COORDS__ = { 
          lat: Number(coords.lat), 
          lng: Number(coords.lng), 
          accuracy: coords.accuracy,
          districtName: coords.districtName 
        };
        return window.__BARAA_GPS_COORDS__;
      }
    }
  } catch {}

  // 3. Check sessionStorage
  try {
    const session = sessionStorage.getItem(STORAGE_KEY);
    if (session) {
      const parsed = JSON.parse(session);
      const coords = parsed.coords || parsed;
      if (coords && coords.lat && coords.lng) {
        window.__BARAA_GPS_COORDS__ = { 
          lat: Number(coords.lat), 
          lng: Number(coords.lng), 
          accuracy: coords.accuracy,
          districtName: coords.districtName 
        };
        return window.__BARAA_GPS_COORDS__;
      }
    }
  } catch {}

  return null;
}

/**
 * Save GPS coordinates to in-memory window, localStorage, and sessionStorage
 * and emit a custom event so all active components sync automatically.
 */
export function saveGpsCoords(coords: GpsCoordinates): void {
  if (typeof window === 'undefined') return;

  window.__BARAA_GPS_COORDS__ = coords;

  const data = {
    coords: { lat: coords.lat, lng: coords.lng },
    districtName: coords.districtName || '',
    locationLink: formatGpsLink(coords),
    accuracy: coords.accuracy || 0,
    timestamp: Date.now()
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}

  try {
    window.dispatchEvent(new CustomEvent('baraa_gps_updated', { detail: coords }));
  } catch {}
}

/**
 * Builds direct Google Maps pinpoint link from GPS coordinates
 */
export function formatGpsLink(coords: { lat: number; lng: number }): string {
  return `https://maps.google.com/?q=${coords.lat},${coords.lng}`;
}

/**
 * Checks if a string is a direct Google Maps link containing numeric latitude/longitude
 */
export function isGpsCoordinateLink(link: string | undefined): boolean {
  if (!link) return false;
  return /maps\.google\.com\/\?q=-?\d+(\.\d+)?,-?\d+(\.\d+)?/.test(link);
}

/**
 * Resolves the ultimate Google Maps link and coordinates for an order:
 * 1. If real hardware coords exist, use them.
 * 2. If no hardware coords, but customer typed a known Mogadishu district/area, use that district's exact GPS coordinates.
 * 3. Fallback to Google Maps query for the typed text.
 */
export function resolveOrderGpsLocation(
  address: string,
  coords?: { lat: number; lng: number } | null,
  locationLink?: string
): { link: string; coords: { lat: number; lng: number } | null } {
  // 1. Direct hardware coordinates
  if (coords && coords.lat && coords.lng) {
    return {
      link: formatGpsLink(coords),
      coords: { lat: coords.lat, lng: coords.lng }
    };
  }

  // 2. Check stored coordinates
  const stored = getStoredGpsCoords();
  if (stored && stored.lat && stored.lng) {
    return {
      link: formatGpsLink(stored),
      coords: { lat: stored.lat, lng: stored.lng }
    };
  }

  // 3. Coordinate link in locationLink
  if (isGpsCoordinateLink(locationLink)) {
    const match = locationLink?.match(/q=(-?\d+(\.\d+)?),(-?\d+(\.\d+)?)/);
    if (match) {
      return {
        link: locationLink!,
        coords: { lat: parseFloat(match[1]), lng: parseFloat(match[3]) }
      };
    }
    return { link: locationLink!, coords: null };
  }

  // 4. Match typed address with Mogadishu districts
  const matchedDistrict = matchMogadishuDistrict(address);
  if (matchedDistrict) {
    const districtCoords = { lat: matchedDistrict.lat, lng: matchedDistrict.lng };
    return {
      link: formatGpsLink(districtCoords),
      coords: districtCoords
    };
  }

  // 5. Fallback query
  const cleanAddress = address && address !== 'Muqdisho' ? address.trim() : 'Mogadishu';
  return {
    link: `https://maps.google.com/?q=${encodeURIComponent(cleanAddress + ', Mogadishu, Somalia')}`,
    coords: null
  };
}

/**
 * Silently inspects if geolocation permission is already granted.
 * Avoids triggering intrusive browser popups or false-alarm errors when user loads the page.
 */
export async function silentCheckGps(): Promise<GpsCoordinates | null> {
  if (typeof window === 'undefined' || !('geolocation' in navigator)) return null;

  try {
    if ('permissions' in navigator && navigator.permissions.query) {
      const perm = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
      if (perm.state !== 'granted') {
        return null;
      }
    } else {
      // If permissions API is not available, do not call getCurrentPosition unprompted
      return null;
    }
  } catch {
    return null;
  }

  try {
    return await requestGpsLocation();
  } catch {
    return null;
  }
}

/**
 * Requests browser geolocation with smart multi-tier strategy:
 * 1. Fast network/cellular geolocation (enableHighAccuracy: false, 6s)
 * 2. If successful, upgrades in background to precision high accuracy (enableHighAccuracy: true)
 * 3. Handles permission denial gracefully with clear Somali error codes
 */
export function requestGpsLocation(): Promise<GpsCoordinates> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      reject(new Error('Aaladaadu ma taageerto GPS Geolocation.'));
      return;
    }

    let resolved = false;

    // Fast attempt: enableHighAccuracy: false gives near-instant results indoors or on mobile data
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (resolved) return;
        resolved = true;
        const lat = Number(position.coords.latitude.toFixed(6));
        const lng = Number(position.coords.longitude.toFixed(6));
        const accuracy = Math.round(position.coords.accuracy || 0);
        const coords: GpsCoordinates = { lat, lng, accuracy };

        saveGpsCoords(coords);
        resolve(coords);

        // Background precision upgrade if possible
        try {
          navigator.geolocation.getCurrentPosition(
            (highPos) => {
              const highCoords: GpsCoordinates = {
                lat: Number(highPos.coords.latitude.toFixed(6)),
                lng: Number(highPos.coords.longitude.toFixed(6)),
                accuracy: Math.round(highPos.coords.accuracy || 0),
              };
              saveGpsCoords(highCoords);
            },
            () => {},
            { enableHighAccuracy: true, timeout: 8000, maximumAge: 10000 }
          );
        } catch {}
      },
      (firstError) => {
        // If permission explicitly denied, reject immediately
        if (firstError.code === 1) {
          reject(firstError);
          return;
        }

        // Try high accuracy with timeout fallback
        navigator.geolocation.getCurrentPosition(
          (position) => {
            if (resolved) return;
            resolved = true;
            const lat = Number(position.coords.latitude.toFixed(6));
            const lng = Number(position.coords.longitude.toFixed(6));
            const accuracy = Math.round(position.coords.accuracy || 0);
            const coords: GpsCoordinates = { lat, lng, accuracy };

            saveGpsCoords(coords);
            resolve(coords);
          },
          (secondError) => {
            if (resolved) return;
            reject(secondError || firstError);
          },
          {
            enableHighAccuracy: true,
            timeout: 9000,
            maximumAge: 30000,
          }
        );
      },
      {
        enableHighAccuracy: false,
        timeout: 6000,
        maximumAge: 60000,
      }
    );
  });
}
