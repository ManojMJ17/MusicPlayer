export interface AppColors {
  background: string;
  surface: string;
  surfaceVariant: string;

  primary: string;
  primaryContainer: string;

  secondary: string;

  text: string;
  textSecondary: string;

  border: string;

  success: string;
  warning: string;
  error: string;

  icon: string;
}

export interface MusicPlayerTheme {
  id: ThemeName;
  displayName: string;
  colors: AppColors;
}

export type ThemeName = 'dark' | 'amoled' | 'ocean' | 'forest' | 'gruvbox';
