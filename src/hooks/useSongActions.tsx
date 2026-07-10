import React, { useState, useCallback, useMemo } from 'react';
import { router } from 'expo-router';

import { ActionSheet, ActionSheetOption } from '@/components/common/ActionSheet';
import { InputDialog } from '@/components/common/InputDialog';
import { SongDetailsModal } from '@/components/music/SongDetailsModal';
import { useLibraryStore } from '@/store/library.store';
import { usePlayerStore } from '@/store/player.store';
import { Song } from '@/types/music';

export function useSongActions(playlistId?: string) {
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [menuSheetVisible, setMenuSheetVisible] = useState(false);
  const [playlistSheetVisible, setPlaylistSheetVisible] = useState(false);
  const [newPlaylistDialogVisible, setNewPlaylistDialogVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  const toggleFavorite = useLibraryStore((state) => state.toggleFavorite);
  const playlists = useLibraryStore((state) => state.playlists);
  const createPlaylist = useLibraryStore((state) => state.createPlaylist);
  const addSongToPlaylist = useLibraryStore((state) => state.addSongToPlaylist);
  const removeSongFromPlaylist = useLibraryStore(
    (state) => state.removeSongFromPlaylist
  );

  const play = usePlayerStore((state) => state.play);
  const addToQueueNext = usePlayerStore((state) => state.addToQueueNext);

  const openMenu = useCallback((song: Song) => {
    setSelectedSong(song);
    setMenuSheetVisible(true);
  }, []);

  const closeAll = useCallback(() => {
    setMenuSheetVisible(false);
    setPlaylistSheetVisible(false);
    setNewPlaylistDialogVisible(false);
    setDetailsModalVisible(false);
    setSelectedSong(null);
  }, []);

  const handleFavorite = useCallback(async () => {
    if (!selectedSong) return;
    await toggleFavorite(selectedSong.id);
    closeAll();
  }, [selectedSong, toggleFavorite, closeAll]);

  const handlePlayNow = useCallback(async () => {
    if (!selectedSong) return;
    await play(selectedSong, [selectedSong]);
    closeAll();
  }, [selectedSong, play, closeAll]);

  const handlePlayNext = useCallback(() => {
    if (!selectedSong) return;
    addToQueueNext(selectedSong);
    closeAll();
  }, [selectedSong, addToQueueNext, closeAll]);

  const handleGoToAlbum = useCallback(() => {
    if (!selectedSong) return;
    const albumKey = selectedSong.album.trim().toLowerCase();
    closeAll();
    router.push({
      pathname: '/library/album/[id]',
      params: { id: albumKey },
    });
  }, [selectedSong, closeAll]);

  const handleGoToArtist = useCallback(() => {
    if (!selectedSong) return;
    const artistKey = selectedSong.artist.trim().toLowerCase();
    closeAll();
    router.push({
      pathname: '/library/artist/[id]',
      params: { id: artistKey },
    });
  }, [selectedSong, closeAll]);

  const handleCreatePlaylist = useCallback(async (name: string) => {
    if (!selectedSong) return;
    const newPlaylist = await createPlaylist(name);
    await addSongToPlaylist(newPlaylist.id, selectedSong.id);
    closeAll();
  }, [selectedSong, createPlaylist, addSongToPlaylist, closeAll]);

  const handleAddToPlaylist = useCallback(async (id: string) => {
    if (!selectedSong) return;
    await addSongToPlaylist(id, selectedSong.id);
    closeAll();
  }, [selectedSong, addSongToPlaylist, closeAll]);

  const handleRemoveFromPlaylist = useCallback(async () => {
    if (!selectedSong || !playlistId) return;
    await removeSongFromPlaylist(playlistId, selectedSong.id);
    closeAll();
  }, [selectedSong, playlistId, removeSongFromPlaylist, closeAll]);

  const menuOptions = useMemo((): ActionSheetOption[] => {
    if (!selectedSong) return [];

    const options: ActionSheetOption[] = [
      {
        label: selectedSong.isFavorite ? 'Remove Favorite' : 'Favorite',
        icon: selectedSong.isFavorite ? 'heart' : 'heart-outline',
        iconType: 'ionicons',
        onPress: handleFavorite,
      },
      {
        label: 'Play Now',
        icon: 'play-arrow',
        onPress: handlePlayNow,
      },
      {
        label: 'Play Next',
        icon: 'playlist-add',
        onPress: handlePlayNext,
      },
      {
        label: 'Add to Playlist',
        icon: 'queue-music',
        onPress: () => {
          setMenuSheetVisible(false);
          setPlaylistSheetVisible(true);
        },
      },
      {
        label: 'Go to Album',
        icon: 'album',
        onPress: handleGoToAlbum,
      },
      {
        label: 'Go to Artist',
        icon: 'person',
        iconType: 'ionicons',
        onPress: handleGoToArtist,
      },
      {
        label: 'Song Details',
        icon: 'info',
        onPress: () => {
          setMenuSheetVisible(false);
          setDetailsModalVisible(true);
        },
      },
    ];

    const isCustomPlaylist = playlistId && playlistId.startsWith('custom-');
    if (isCustomPlaylist) {
      options.push({
        label: 'Remove from Playlist',
        icon: 'delete',
        onPress: handleRemoveFromPlaylist,
        destructive: true,
      });
    }

    return options;
  }, [
    selectedSong,
    handleFavorite,
    handlePlayNow,
    handlePlayNext,
    handleGoToAlbum,
    handleGoToArtist,
    handleRemoveFromPlaylist,
    playlistId,
  ]);

  const playlistOptions = useMemo((): ActionSheetOption[] => {
    const options: ActionSheetOption[] = [
      {
        label: 'Create New Playlist',
        icon: 'add',
        onPress: () => {
          setPlaylistSheetVisible(false);
          setNewPlaylistDialogVisible(true);
        },
      },
    ];

    const customPlaylists = playlists.filter((p) => p.id.startsWith('custom-'));
    customPlaylists.forEach((p) => {
      options.push({
        label: p.name,
        icon: 'queue-music',
        onPress: () => handleAddToPlaylist(p.id),
      });
    });

    return options;
  }, [playlists, handleAddToPlaylist]);

  const renderActionSheets = useCallback(() => {
    if (!selectedSong) return null;

    return (
      <>
        {/* Main Song Actions Sheet */}
        <ActionSheet
          visible={menuSheetVisible}
          onClose={closeAll}
          title={selectedSong.title}
          subtitle={selectedSong.artist}
          headerImage={selectedSong.artwork}
          options={menuOptions}
        />

        {/* Add to Playlist Custom Sheet */}
        <ActionSheet
          visible={playlistSheetVisible}
          onClose={closeAll}
          title='Add to Playlist'
          subtitle='Select a playlist to add this song to'
          options={playlistOptions}
        />

        {/* New Playlist Name Input Dialog */}
        <InputDialog
          visible={newPlaylistDialogVisible}
          title='New Playlist'
          placeholder='Playlist Name'
          onClose={closeAll}
          onSubmit={handleCreatePlaylist}
        />

        {/* Song Rich Metadata Modal */}
        <SongDetailsModal
          visible={detailsModalVisible}
          song={selectedSong}
          onClose={closeAll}
        />
      </>
    );
  }, [
    selectedSong,
    menuSheetVisible,
    playlistSheetVisible,
    newPlaylistDialogVisible,
    detailsModalVisible,
    menuOptions,
    playlistOptions,
    handleCreatePlaylist,
    closeAll,
  ]);

  return {
    openMenu,
    renderActionSheets,
  };
}
