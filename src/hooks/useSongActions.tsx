import { useCallback } from 'react';

import { useActionMenu } from './useActionMenu';

import { Album, Artist, Playlist, Song } from '@/types/music';

export function useSongActions(playlistId?: string) {
  const { openMenu, renderActionSheets } = useActionMenu(playlistId);

  const openSongMenu = useCallback(
    (song: Song) => {
      openMenu(song, 'song');
    },
    [openMenu]
  );

  return {
    openMenu: openSongMenu,
    renderActionSheets,
  };
}

export function useAlbumActions() {
  const { openMenu, renderActionSheets } = useActionMenu();

  const openAlbumMenu = useCallback(
    (album: Album) => {
      openMenu(album, 'album');
    },
    [openMenu]
  );

  return {
    openMenu: openAlbumMenu,
    renderActionSheets,
  };
}

export function useArtistActions() {
  const { openMenu, renderActionSheets } = useActionMenu();

  const openArtistMenu = useCallback(
    (artist: Artist) => {
      openMenu(artist, 'artist');
    },
    [openMenu]
  );

  return {
    openMenu: openArtistMenu,
    renderActionSheets,
  };
}

export function usePlaylistActions() {
  const { openMenu, renderActionSheets } = useActionMenu();

  const openPlaylistMenu = useCallback(
    (playlist: Playlist) => {
      openMenu(playlist, 'playlist');
    },
    [openMenu]
  );

  return {
    openMenu: openPlaylistMenu,
    renderActionSheets,
  };
}
