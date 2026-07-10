import { PropsWithChildren, useEffect } from 'react';

import { useThemeStore } from '@/store/theme.store';

export function ThemeProvider({ children }: PropsWithChildren) {
  const loadTheme = useThemeStore((state) => state.loadTheme);

useEffect(() => {
  void loadTheme();
}, []);

  return children;
}
