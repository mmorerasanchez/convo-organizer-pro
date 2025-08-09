import React from 'react';
import { useMixpanelPageTracking } from '@/hooks/useMixpanelPageTracking';

export const PageTracker: React.FC = () => {
  useMixpanelPageTracking();
  return null;
};

export default PageTracker;
