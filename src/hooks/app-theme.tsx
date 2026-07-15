import { createContext, type PropsWithChildren, useContext } from 'react';
import { useColorScheme } from 'react-native';

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

const AppThemeContext = createContext<AppTheme | null>(null);

type AppThemeProviderProps = PropsWithChildren<{
  /** Explicit override for previews and tests. The app follows the system scheme when omitted. */
  theme?: AppTheme;
}>;

export function AppThemeProvider({ children, theme }: AppThemeProviderProps) {
  const colorScheme = useColorScheme();
  const resolvedTheme = theme ?? (colorScheme === 'dark' ? darkTheme : lightTheme);

  return <AppThemeContext.Provider value={resolvedTheme}>{children}</AppThemeContext.Provider>;
}

export function useAppTheme() {
  const theme = useContext(AppThemeContext);

  if (!theme) {
    throw new Error('useAppTheme must be used inside AppThemeProvider');
  }

  return theme;
}
