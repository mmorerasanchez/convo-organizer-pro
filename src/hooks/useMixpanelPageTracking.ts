import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { track, initMixpanel } from '@/lib/analytics/mixpanel';

export function useMixpanelPageTracking() {
  const location = useLocation();

  useEffect(() => {
    // Ensure initialized (no-op if already)
    initMixpanel();
  }, []);

  useEffect(() => {
    const path = location.pathname + location.search + location.hash;
    track('Page Viewed', {
      path,
      title: typeof document !== 'undefined' ? document.title : undefined,
    });
  }, [location]);
}
