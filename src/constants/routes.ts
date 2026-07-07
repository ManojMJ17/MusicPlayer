export const Routes = {
  tabs: {
    songs: '/(tabs)/songs',
    albums: '/(tabs)/albums',
    artists: '/(tabs)/artists',
    playlists: '/(tabs)/playlists',
    settings: '/(tabs)/settings',
  },

  player: '/player',

  search: '/search',
} as const;

export type TabRoute = (typeof Routes.tabs)[keyof typeof Routes.tabs];
export type AppRoute = TabRoute | typeof Routes.player | typeof Routes.search;
