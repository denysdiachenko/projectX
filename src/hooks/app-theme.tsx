import { createContext, type PropsWithChildren, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

import {
  getStoredThemeMode,
  storeThemeMode,
  type ThemeMode,
} from '@/services/preferences-storage';
import {
  colors,
  darkColors,
  type AppColors,
  fontFamily,
  layoutSpacing,
  primitiveColors,
  spacing,
  typography,
} from '@/theme';

export type AppTheme = Readonly<{
  name: 'light' | 'dark';
  colors: AppColors;
  primitives: typeof primitiveColors;
  spacing: typeof spacing;
  layoutSpacing: typeof layoutSpacing;
  typography: typeof typography;
  fontFamily: typeof fontFamily;
  statusBar: 'dark' | 'light';
}>;

export const lightTheme: AppTheme = {
  name: 'light',
  colors,
  primitives: primitiveColors,
  spacing,
  layoutSpacing,
  typography,
  fontFamily,
  statusBar: 'dark',
};

export const darkTheme: AppTheme = {
  name: 'dark',
  colors: darkColors,
  primitives: primitiveColors,
  spacing,
  layoutSpacing,
  typography,
  fontFamily,
  statusBar: 'light',
};

type AppThemeContextValue = AppTheme & {
  mode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
};

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

type AppThemeProviderProps = PropsWithChildren<{
  /** Explicit override for previews and tests. The app follows the system scheme when omitted. */
  theme?: AppTheme;
}>;

export function AppThemeProvider({ children, theme }: AppThemeProviderProps) {
  const colorScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>(getStoredThemeMode);
  const resolvedTheme =
    theme ??
    (mode === 'dark' || (mode === 'system' && colorScheme === 'dark') ? darkTheme : lightTheme);
  const value = useMemo<AppThemeContextValue>(
    () => ({
      ...resolvedTheme,
      mode: theme?.name ?? mode,
      setThemeMode: (nextMode) => {
        setMode(nextMode);
        storeThemeMode(nextMode);
      },
    }),
    [mode, resolvedTheme, theme?.name],
  );

  return <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>;
}

export function useAppTheme() {
  const theme = useContext(AppThemeContext);

  if (!theme) {
    throw new Error('useAppTheme must be used inside AppThemeProvider');
  }

  return theme;
}
