import type { Session, User } from '@supabase/supabase-js';
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AppState, Platform } from 'react-native';

import { supabase } from '@/lib/supabase';
import { setSupabaseUnauthorizedHandler } from '@/lib/supabase-fetch';

type AppAuthContextValue = {
  isLoading: boolean;
  session: Session | null;
  user: User | null;
};

const AppAuthContext = createContext<AppAuthContextValue | null>(null);

export function AppAuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let signOutPromise: Promise<void> | null = null;

    const invalidateSession = () => {
      if (mounted) {
        setSession(null);
      }

      if (!signOutPromise) {
        signOutPromise = supabase.auth
          .signOut({ scope: 'local' })
          .then(() => undefined)
          .finally(() => {
            signOutPromise = null;
          });
      }

      return signOutPromise;
    };

    const removeUnauthorizedHandler = setSupabaseUnauthorizedHandler(() => {
      void invalidateSession();
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
    });

    const initializeSession = async () => {
      const {
        data: { session: storedSession },
      } = await supabase.auth.getSession();

      if (!storedSession) {
        if (mounted) setSession(null);
        return;
      }

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error?.status === 401 || error?.status === 403 || (!error && !user)) {
        await invalidateSession();
        return;
      }

      if (mounted) {
        setSession(storedSession);
      }
    };

    void initializeSession().finally(() => {
      if (mounted) setIsLoading(false);
    });

    return () => {
      mounted = false;
      removeUnauthorizedHandler();
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web') return;

    const updateAutoRefresh = (state: string) => {
      if (state === 'active') {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    };
    updateAutoRefresh(AppState.currentState);
    const subscription = AppState.addEventListener('change', updateAutoRefresh);

    return () => {
      subscription.remove();
      supabase.auth.stopAutoRefresh();
    };
  }, []);

  const value = useMemo<AppAuthContextValue>(
    () => ({
      isLoading,
      session,
      user: session?.user ?? null,
    }),
    [isLoading, session],
  );

  return <AppAuthContext.Provider value={value}>{children}</AppAuthContext.Provider>;
}

export function useAppAuth() {
  const context = useContext(AppAuthContext);

  if (!context) {
    throw new Error('useAppAuth must be used within AppAuthProvider');
  }

  return context;
}
