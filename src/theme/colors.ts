export const primitiveColors = {
  mint: {
    50: '#E5F8F5',
    100: '#C6F0EA',
    200: '#93E1D6',
    300: '#66D5C6',
    400: '#43C5B5',
    500: '#35CDB5',
    600: '#24B3A2',
    700: '#178A7F',
    800: '#116E63',
    900: '#0C554D',
  },
  violet: {
    50: '#F3F1FD',
    100: '#E4E0FA',
    200: '#C7BEF4',
    300: '#A99BEB',
    400: '#8777DE',
    500: '#6C5DD3',
    600: '#5A48BE',
    700: '#4738A0',
    800: '#382C80',
    900: '#2A2261',
  },
  coral: {
    50: '#FFF0F0',
    100: '#FFDADA',
    300: '#FF9A9A',
    500: '#FF6B6B',
    600: '#E95757',
    700: '#C94444',
  },
  yellow: {
    50: '#FFF9E8',
    100: '#FFF0BE',
    300: '#FFD875',
    500: '#FFC94A',
    600: '#E5AE25',
    700: '#B98212',
  },
  sky: {
    50: '#EEF7FF',
    100: '#D6ECFD',
    300: '#8FC8FA',
    500: '#55A7F2',
    600: '#3B8DD5',
    700: '#2B69A8',
  },
  neutral: {
    0: '#FFFFFF',
    50: '#F6F7FB',
    100: '#EEF1F6',
    200: '#D9DFEA',
    300: '#C7CFDA',
    400: '#A8B2C5',
    500: '#98A2B6',
    600: '#69738A',
    700: '#4F5A6F',
    800: '#344054',
    900: '#21283B',
    950: '#141821',
    1000: '#000000',
  },
} as const;

export const colors = {
  background: {
    canvas: primitiveColors.neutral[50],
    surface: primitiveColors.neutral[0],
    subtle: primitiveColors.mint[50],
    brand: primitiveColors.mint[500],
    accent: primitiveColors.violet[500],
  },
  text: {
    primary: primitiveColors.neutral[900],
    secondary: primitiveColors.neutral[600],
    muted: primitiveColors.neutral[500],
    brand: primitiveColors.mint[800],
    onBrand: primitiveColors.neutral[0],
  },
  border: {
    default: primitiveColors.neutral[200],
    strong: primitiveColors.neutral[400],
    brand: primitiveColors.mint[500],
  },
  action: {
    primary: primitiveColors.mint[500],
    primaryPressed: primitiveColors.mint[600],
    secondary: primitiveColors.neutral[0],
    secondaryPressed: primitiveColors.neutral[100],
    disabled: primitiveColors.neutral[200],
  },
  status: {
    successBackground: primitiveColors.mint[50],
    successForeground: primitiveColors.mint[800],
    warningBackground: primitiveColors.yellow[50],
    warningForeground: primitiveColors.yellow[700],
    errorBackground: primitiveColors.coral[50],
    errorForeground: primitiveColors.coral[700],
    infoBackground: primitiveColors.sky[50],
    infoForeground: primitiveColors.sky[700],
  },
  external: {
    google: '#4285F4',
  },
} as const;

type WidenColorValues<T> = {
  readonly [Key in keyof T]: T[Key] extends string ? string : WidenColorValues<T[Key]>;
};

export type AppColors = WidenColorValues<typeof colors>;

export const darkColors: AppColors = {
  background: {
    canvas: primitiveColors.neutral[950],
    surface: primitiveColors.neutral[900],
    subtle: '#183D38',
    brand: primitiveColors.mint[500],
    accent: primitiveColors.violet[400],
  },
  text: {
    primary: primitiveColors.neutral[0],
    secondary: primitiveColors.neutral[300],
    muted: primitiveColors.neutral[400],
    brand: primitiveColors.mint[200],
    onBrand: primitiveColors.neutral[950],
  },
  border: {
    default: primitiveColors.neutral[800],
    strong: primitiveColors.neutral[700],
    brand: primitiveColors.mint[400],
  },
  action: {
    primary: primitiveColors.mint[400],
    primaryPressed: primitiveColors.mint[300],
    secondary: primitiveColors.neutral[900],
    secondaryPressed: primitiveColors.neutral[800],
    disabled: primitiveColors.neutral[800],
  },
  status: {
    successBackground: '#183D38',
    successForeground: primitiveColors.mint[200],
    warningBackground: '#453711',
    warningForeground: primitiveColors.yellow[300],
    errorBackground: '#4A2428',
    errorForeground: primitiveColors.coral[300],
    infoBackground: '#173753',
    infoForeground: primitiveColors.sky[300],
  },
  external: {
    google: '#8AB4F8',
  },
};
