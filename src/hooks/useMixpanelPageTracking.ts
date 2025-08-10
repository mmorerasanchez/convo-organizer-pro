import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { track, initMixpanel } from '@/lib/analytics/mixpanel';

export function useMixpanelPageTracking() {
  const location = useLocation();
  const previousPath = useRef<string>('');
  const pageStartTime = useRef<number>(Date.now());

  useEffect(() => {
    // Ensure initialized (no-op if already)
    initMixpanel();
  }, []);

  useEffect(() => {
    const currentPath = location.pathname + location.search + location.hash;

    // Track time spent on previous page
    if (previousPath.current) {
      const timeOnPage = Date.now() - pageStartTime.current;
      track('Page Left', {
        page_path: previousPath.current,
        time_on_page_seconds: Math.round(timeOnPage / 1000),
      });
    }

    // Track the new page view
    track('Page Viewed', {
      page_path: currentPath,
      page_title: typeof document !== 'undefined' ? document.title : undefined,
      page_referrer: typeof document !== 'undefined' ? document.referrer : undefined,
      search_params: location.search,
    });

    previousPath.current = currentPath;
    pageStartTime.current = Date.now();
  }, [location]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!previousPath.current) return;
      const timeOnPage = Date.now() - pageStartTime.current;
      track('Session Ended', {
        final_page: previousPath.current,
        total_time_seconds: Math.round(timeOnPage / 1000),
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);
}

