import { amoledTheme } from './themes/amoled';
import { darkTheme } from './themes/dark';
import { forestTheme } from './themes/forest';
import { oceanTheme } from './themes/ocean';
import { gruvboxTheme } from './themes/gruvbox';
import { MusicPlayerTheme, ThemeName } from './types';

export const themes: Record<ThemeName, MusicPlayerTheme> = {
  dark: darkTheme,
  amoled: amoledTheme,
  ocean: oceanTheme,
  forest: forestTheme,
  gruvbox: gruvboxTheme,
};

export const themeList = Object.values(themes);
