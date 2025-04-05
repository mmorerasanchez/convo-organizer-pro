
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export const useRequireAuth = (redirectUrl = '/auth') => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate(redirectUrl);
    }
  }, [user, loading, navigate, redirectUrl]);

  return { user, loading };
};
