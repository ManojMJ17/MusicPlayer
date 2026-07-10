import { useThemeStore } from '@/store/theme.store';
import { themes } from './themes';

export function useTheme() {
  const theme = useThemeStore((state) => state.theme);

  return themes[theme];
}
