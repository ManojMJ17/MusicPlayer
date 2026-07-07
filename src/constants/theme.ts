export const Theme = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
  },

  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
  },

  icon: {
    sm: 18,
    md: 24,
    lg: 32,
    xl: 48,
  },

  avatar: {
    sm: 36,
    md: 48,
    lg: 64,
  },

  borderWidth: {
    thin: 1,
    medium: 2,
  },

  opacity: {
    disabled: 0.4,
    pressed: 0.7,
  },

  elevation: {
    none: 0,
    sm: 2,
    md: 4,
    lg: 8,
  },
} as const;

export type AppTheme = typeof Theme;
