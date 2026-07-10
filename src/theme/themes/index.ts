import { MusicPlayerTheme, ThemeName } from '../types';

import { amoledTheme } from './amoled';
import { darkTheme } from './dark';
import { forestTheme } from './forest';
import { oceanTheme } from './ocean';
import { gruvboxTheme } from './gruvbox';

export const themes: Record<ThemeName, MusicPlayerTheme> = {
  dark: darkTheme,
  amoled: amoledTheme,
  ocean: oceanTheme,
  forest: forestTheme,
  gruvbox: gruvboxTheme,
};

export const themeList: MusicPlayerTheme[] = Object.values(themes);

export { amoledTheme, darkTheme, forestTheme, oceanTheme, gruvboxTheme };
