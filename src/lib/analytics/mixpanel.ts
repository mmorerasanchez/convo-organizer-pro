import mixpanel from 'mixpanel-browser';

let initialized = false;
let dntEnabled = false;

// Public project token (safe to expose in frontend)
const TOKEN = '66f8520259897e82006d28fb9f418e76';
// EU residency per request
const API_HOST = 'https://api-eu.mixpanel.com';

function checkDNT(): boolean {
  try {
    return typeof navigator !== 'undefined' && ((navigator as any).doNotTrack === '1' || (window as any).doNotTrack === '1');
  } catch {
    return false;
  }
}

export function initMixpanel() {
  if (initialized) return true;

  dntEnabled = checkDNT();
  if (dntEnabled) return false;

  const token = TOKEN;
  if (!token) return false;

  try {
    mixpanel.init(token, {
      api_host: API_HOST,
      debug: import.meta.env.DEV,
      track_pageview: false,
      persistence: 'localStorage',
      batch_requests: true,
      batch_size: 50,
      batch_flush_interval_ms: 5000,
      secure_cookie: !import.meta.env.DEV,
      ignore_dnt: false,
    });
    initialized = true;
    return true;
  } catch {
    return false;
  }
}

function ensureInitialized() {
  return initialized || initMixpanel();
}

export function track(event: string, props?: Record<string, any>) {
  if (dntEnabled || !ensureInitialized()) return;
  try {
    mixpanel.track(event, {
      ...props,
      page_url: typeof window !== 'undefined' ? window.location.href : undefined,
      timestamp: new Date().toISOString(),
      environment: import.meta.env.MODE,
    });
  } catch {}
}

export function identify(userId: string) {
  if (dntEnabled || !ensureInitialized()) return;
  try {
    mixpanel.identify(userId);
  } catch {}
}

export function peopleSet(props: Record<string, any>) {
  if (dntEnabled || !ensureInitialized()) return;
  try {
    mixpanel.people.set(props);
  } catch {}
}

export function reset() {
  if (!initialized) return;
  try {
    mixpanel.reset();
  } catch {}
  initialized = false;
}

