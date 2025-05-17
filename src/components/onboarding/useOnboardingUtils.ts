import { useSearchParams } from 'react-router-dom';

export const useOnboardingUtils = () => {
  const [searchParams] = useSearchParams();
  
  // Extract tab from URL if present
  const getRouteWithTabParameter = (route: string) => {
    if (route.includes('/prompting')) {
      // If the route already has a tab parameter, use it
      if (route.includes('?tab=')) {
        return route;
      }
      
      // Otherwise, use the current tab or default to 'designer'
      const currentTab = searchParams.get('tab') || 'designer';
      return `/prompting?tab=${currentTab}`;
    }
    return route;
  };

  return {
    getRouteWithTabParameter
  };
};
