export const Colors = {
  light: {
    background: '#F8F9FA',
    surface: '#FFFFFF',
    surfaceVariant: '#F1F3F5',

    primary: '#1A73E8',
    primaryContainer: '#D2E3FC',

    secondary: '#5F6368',

    text: '#202124',
    textSecondary: '#5F6368',

    border: '#E0E0E0',

    success: '#34A853',
    warning: '#FBBC04',
    error: '#EA4335',

    icon: '#5F6368',
  },

  dark: {
    background: '#121212',
    surface: '#1E1E1E',
    surfaceVariant: '#2A2A2A',

    primary: '#8AB4F8',
    primaryContainer: '#1A73E8',

    secondary: '#BDC1C6',

    text: '#FFFFFF',
    textSecondary: '#9AA0A6',

    border: '#303134',

    success: '#81C995',
    warning: '#FDD663',
    error: '#F28B82',

    icon: '#E8EAED',
  },
} as const;

export type ColorScheme = keyof typeof Colors;
