// UTM Persistence Script
// Captures UTMs from URL on first visit and stores them in sessionStorage

const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'fclid',
  'dclid'
] as const;

const STORAGE_KEY = 'cmeo_utm_params';

export interface UTMParams {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
  gclid: string;
  fclid: string;
  dclid: string;
}

// Capture UTMs from current URL and save to sessionStorage
export function captureUtmParams(): void {
  const params = new URLSearchParams(window.location.search);
  const hasUtmInUrl = UTM_KEYS.some(key => params.has(key));

  // Only update storage if URL has UTM params (new visit with tracking)
  if (hasUtmInUrl) {
    const utmData: Record<string, string> = {};

    UTM_KEYS.forEach(key => {
      const value = params.get(key);
      if (value) {
        utmData[key] = value;
      }
    });

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utmData));
  }
}

// Get stored UTM params (from sessionStorage or URL as fallback)
export function getUtmParams(): UTMParams {
  // First try sessionStorage
  const stored = sessionStorage.getItem(STORAGE_KEY);

  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return {
        utm_source: parsed.utm_source || '',
        utm_medium: parsed.utm_medium || '',
        utm_campaign: parsed.utm_campaign || '',
        utm_term: parsed.utm_term || '',
        utm_content: parsed.utm_content || '',
        gclid: parsed.gclid || '',
        fclid: parsed.fclid || '',
        dclid: parsed.dclid || '',
      };
    } catch {
      // Invalid JSON, fall through to URL params
    }
  }

  // Fallback to URL params
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') || '',
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '',
    utm_term: params.get('utm_term') || '',
    utm_content: params.get('utm_content') || '',
    gclid: params.get('gclid') || '',
    fclid: params.get('fclid') || '',
    dclid: params.get('dclid') || '',
  };
}

// Initialize on page load
export function initUtmPersistence(): void {
  captureUtmParams();
}
