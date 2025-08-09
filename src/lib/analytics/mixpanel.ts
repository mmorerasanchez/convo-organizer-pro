import mixpanel from 'mixpanel-browser';

let initialized = false;

function getStoredToken(): string | null {
  try {
    const stored = localStorage.getItem('MIXPANEL_TOKEN');
    if (stored) return stored;
    const w: any = typeof window !== 'undefined' ? (window as any) : undefined;
    return (w && w.__MIXPANEL_TOKEN__) || null;
  } catch {
    return null;
  }
}

function getStoredApiHost(): string | undefined {
  try {
    const host = localStorage.getItem('MIXPANEL_API_HOST') || undefined;
    return host || undefined;
  } catch {
    return undefined;
  }
}

export function initMixpanel(options?: { token?: string; apiHost?: string }) {
  if (initialized) return true;

  const token = options?.token || getStoredToken();
  if (!token) return false; // No-op if no token configured

  const apiHost = options?.apiHost || getStoredApiHost();

  mixpanel.init(token, {
    api_host: apiHost,
    debug: import.meta.env.DEV,
    track_pageview: false,
    persistence: 'localStorage',
  });
  initialized = true;
  return true;
}

export function configureMixpanel(token: string, apiHost?: string) {
  try {
    localStorage.setItem('MIXPANEL_TOKEN', token);
    if (apiHost) localStorage.setItem('MIXPANEL_API_HOST', apiHost);
  } catch {}
  return initMixpanel({ token, apiHost });
}

export function isMixpanelEnabled() {
  return initialized || Boolean(getStoredToken());
}

export function track(event: string, props?: Record<string, any>) {
  if (!initialized && !initMixpanel()) return; // attempt lazy init
  try {
    mixpanel.track(event, props);
  } catch {}
}

export function identify(userId: string) {
  if (!initialized && !initMixpanel()) return;
  try {
    mixpanel.identify(userId);
  } catch {}
}

export function peopleSet(props: Record<string, any>) {
  if (!initialized && !initMixpanel()) return;
  try {
    mixpanel.people.set(props);
  } catch {}
}

export function reset() {
  if (!initialized && !initMixpanel()) return;
  try {
    mixpanel.reset();
    initialized = false;
  } catch {}
}
