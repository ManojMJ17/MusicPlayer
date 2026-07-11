import { router } from 'expo-router';
import {
  Disc,
  Heart,
  Info,
  ListMusic,
  ListPlus,
  LucideIcon,
  Music,
  Pencil,
  Play,
  Plus,
  Shuffle,
  Trash2,
  User
} from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { ActionSheet, ActionSheetOption } from '@/components/common/ActionSheet';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { DetailsModal } from '@/components/common/DetailsModal';
import { SongDetailsModal } from '@/components/music/SongDetailsModal';
import { PlaylistEditorDialog } from '@/components/playlist/PlaylistEditorDialog';
import { getPlaylistIcon } from '@/constants/playlist-icons';
import { artworkService } from '@/services/artwork.service';
import { useLibraryStore } from '@/store/library.store';
import { usePlayerStore } from '@/store/player.store';
import { Album, Artist, Playlist, Song } from '@/types/music';

const FilledHeart = ((props: any) => <Heart {...props} fill={props.color} />) as LucideIcon;

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const formatTotalDuration = (ms: number) => {
  const totalSecs = Math.floor(ms / 1000);
  const hrs = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;

  if (hrs > 0) {
    return `${hrs}h ${mins}m`;
  }
  if (mins > 0) {
    return `${mins}m ${secs}s`;
  }
  return `${secs}s`;
};

export function useActionMenu(playlistId?: string) {
  const [selectedItem, setSelectedItem] = useState<Song | Album | Artist | Playlist | null>(null);
  const [itemType, setItemType] = useState<'song' | 'album' | 'artist' | 'playlist' | null>(null);

  const [menuSheetVisible, setMenuSheetVisible] = useState(false);
  const [playlistSheetVisible, setPlaylistSheetVisible] = useState(false);
  const [songSheetVisible, setSongSheetVisible] = useState(false);
  const [newPlaylistDialogVisible, setNewPlaylistDialogVisible] = useState(false);
  const [renamePlaylistDialogVisible, setRenamePlaylistDialogVisible] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [songArtwork, setSongArtwork] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    if (itemType === 'song' && selectedItem) {
      artworkService.getArtwork(selectedItem.id).then((image) => {
        if (mounted) {
          setSongArtwork(image);
        }
      });
    }
    return () => {
      mounted = false;
    };
  }, [selectedItem, itemType]);

  // Store references
  const songs = useLibraryStore((state) => state.songs);
  const playlists = useLibraryStore((state) => state.playlists);
  const toggleFavorite = useLibraryStore((state) => state.toggleFavorite);
  const createPlaylist = useLibraryStore((state) => state.createPlaylist);
  const addSongToPlaylist = useLibraryStore((state) => state.addSongToPlaylist);
  const removeSongFromPlaylist = useLibraryStore((state) => state.removeSongFromPlaylist);
  const renamePlaylist = useLibraryStore((state) => state.renamePlaylist);
  const deletePlaylist = useLibraryStore((state) => state.deletePlaylist);

  const play = usePlayerStore((state) => state.play);
  const addToQueueNext = usePlayerStore((state) => state.addToQueueNext);

  const openMenu = useCallback((item: Song | Album | Artist | Playlist, type: 'song' | 'album' | 'artist' | 'playlist') => {
    setSelectedItem(item);
    setItemType(type);
    setSongArtwork(null);
    setMenuSheetVisible(true);
  }, []);

  const closeAll = useCallback(() => {
    setMenuSheetVisible(false);
    setPlaylistSheetVisible(false);
    setSongSheetVisible(false);
    setNewPlaylistDialogVisible(false);
    setRenamePlaylistDialogVisible(false);
    setDeleteConfirmVisible(false);
    setDetailsModalVisible(false);
    setSelectedItem(null);
    setItemType(null);
    setSongArtwork(null);
  }, []);

  // Song specific handlers
  const handleRemoveFromPlaylist = useCallback(async () => {
    if (!selectedItem || !playlistId) return;
    await removeSongFromPlaylist(playlistId, selectedItem.id);
    closeAll();
  }, [selectedItem, playlistId, removeSongFromPlaylist, closeAll]);

  const handleSongFavorite = useCallback(async () => {
    if (!selectedItem || itemType !== 'song') return;
    await toggleFavorite(selectedItem.id);
    closeAll();
  }, [selectedItem, itemType, toggleFavorite, closeAll]);

  const handleSongPlayNow = useCallback(async () => {
    if (!selectedItem || itemType !== 'song') return;
    const song = selectedItem as Song;
    await play(song, [song]);
    closeAll();
  }, [selectedItem, itemType, play, closeAll]);

  const handleSongPlayNext = useCallback(() => {
    if (!selectedItem || itemType !== 'song') return;
    addToQueueNext(selectedItem as Song);
    closeAll();
  }, [selectedItem, itemType, addToQueueNext, closeAll]);

  const handleGoToAlbum = useCallback(() => {
    if (!selectedItem || itemType !== 'song') return;
    const song = selectedItem as Song;
    const albumKey = song.album.trim().toLowerCase();
    closeAll();
    router.push({
      pathname: '/albums/[id]',
      params: { id: albumKey },
    });
  }, [selectedItem, itemType, closeAll]);

  const handleGoToArtist = useCallback(() => {
    if (!selectedItem || itemType !== 'song') return;
    const song = selectedItem as Song;
    const artistKey = song.artist.trim().toLowerCase();
    closeAll();
    router.push({
      pathname: '/artists/[id]',
      params: { id: artistKey },
    });
  }, [selectedItem, itemType, closeAll]);

  // Playlist handlers
  const handlePlaylistPlay = useCallback(async (shuffle = false) => {
    if (!selectedItem || itemType !== 'playlist') return;
    const playlist = selectedItem as Playlist;
    const playlistSongs = playlist.songIds
      .map((id) => songs.find((s) => s.id === id))
      .filter((s): s is Song => s !== undefined);

    if (playlistSongs.length === 0) {
      closeAll();
      return;
    }

    const songsToPlay = shuffle ? shuffleArray(playlistSongs) : playlistSongs;
    await play(songsToPlay[0], songsToPlay);
    closeAll();
  }, [selectedItem, itemType, songs, play, closeAll]);

  const handlePlaylistRename = useCallback(async (name: string, icon?: string) => {
    if (!selectedItem || itemType !== 'playlist') return;
    await renamePlaylist(selectedItem.id, name, icon);
    closeAll();
  }, [selectedItem, itemType, renamePlaylist, closeAll]);

  const handlePlaylistDelete = useCallback(async () => {
    if (!selectedItem || itemType !== 'playlist') return;
    await deletePlaylist(selectedItem.id);
    closeAll();
  }, [selectedItem, itemType, deletePlaylist, closeAll]);

  // Album handlers
  const getAlbumSongs = useCallback((): Song[] => {
    if (!selectedItem || itemType !== 'album') return [];
    const album = selectedItem as Album;
    return songs.filter(
      (s) => s.album.trim().toLowerCase() === album.title.trim().toLowerCase()
    );
  }, [selectedItem, itemType, songs]);

  const handleAlbumPlay = useCallback(async (shuffle = false) => {
    const albumSongs = getAlbumSongs();
    if (albumSongs.length === 0) {
      closeAll();
      return;
    }
    const songsToPlay = shuffle ? shuffleArray(albumSongs) : albumSongs;
    await play(songsToPlay[0], songsToPlay);
    closeAll();
  }, [getAlbumSongs, play, closeAll]);

  const handleAddAlbumToPlaylist = useCallback(async (playlistId: string) => {
    const albumSongs = getAlbumSongs();
    for (const song of albumSongs) {
      await addSongToPlaylist(playlistId, song.id);
    }
    closeAll();
  }, [getAlbumSongs, addSongToPlaylist, closeAll]);

  // Artist handlers
  const getArtistSongs = useCallback((): Song[] => {
    if (!selectedItem || itemType !== 'artist') return [];
    const artist = selectedItem as Artist;
    return songs.filter(
      (s) => s.artist.trim().toLowerCase() === artist.name.trim().toLowerCase()
    );
  }, [selectedItem, itemType, songs]);

  const handleArtistPlay = useCallback(async (shuffle = false) => {
    const artistSongs = getArtistSongs();
    if (artistSongs.length === 0) {
      closeAll();
      return;
    }
    const songsToPlay = shuffle ? shuffleArray(artistSongs) : artistSongs;
    await play(songsToPlay[0], songsToPlay);
    closeAll();
  }, [getArtistSongs, play, closeAll]);

  // Playlist adding song handlers
  const handleAddSongToPlaylistAction = useCallback(async (playlistId: string) => {
    if (!selectedItem) return;
    await addSongToPlaylist(playlistId, selectedItem.id);
    closeAll();
  }, [selectedItem, addSongToPlaylist, closeAll]);

  const handleCreatePlaylistAndAdd = useCallback(async (name: string, icon?: string) => {
    if (!selectedItem) return;
    const newPlaylist = await createPlaylist(name, icon);
    if (itemType === 'song') {
      await addSongToPlaylist(newPlaylist.id, selectedItem.id);
    } else if (itemType === 'album') {
      const albumSongs = getAlbumSongs();
      for (const s of albumSongs) {
        await addSongToPlaylist(newPlaylist.id, s.id);
      }
    }
    closeAll();
  }, [selectedItem, itemType, createPlaylist, addSongToPlaylist, getAlbumSongs, closeAll]);

  // Menu Options Builder
  const menuOptions = useMemo((): ActionSheetOption[] => {
    if (!selectedItem || !itemType) return [];

    switch (itemType) {
      case 'song': {
        const song = selectedItem as Song;
        const options: ActionSheetOption[] = [
          {
            label: song.isFavorite ? 'Remove Favorite' : 'Favorite',
            icon: song.isFavorite ? FilledHeart : Heart,
            onPress: handleSongFavorite,
          },
          {
            label: 'Play Now',
            icon: Play,
            onPress: handleSongPlayNow,
          },
          {
            label: 'Play Next',
            icon: ListPlus,
            onPress: handleSongPlayNext,
          },
          {
            label: 'Add to Playlist',
            icon: ListMusic,
            onPress: () => {
              setMenuSheetVisible(false);
              setPlaylistSheetVisible(true);
            },
          },
          {
            label: 'Go to Album',
            icon: Disc,
            onPress: handleGoToAlbum,
          },
          {
            label: 'Go to Artist',
            icon: User,
            onPress: handleGoToArtist,
          },
          {
            label: 'Song Details',
            icon: Info,
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
            icon: Trash2,
            onPress: handleRemoveFromPlaylist,
            destructive: true,
          });
        }

        return options;
      }
      case 'album': {
        return [
          {
            label: 'Play Album',
            icon: Play,
            onPress: () => handleAlbumPlay(false),
          },
          {
            label: 'Shuffle Play',
            icon: Shuffle,
            onPress: () => handleAlbumPlay(true),
          },
          {
            label: 'Add Album to Playlist',
            icon: Music,
            onPress: () => {
              setMenuSheetVisible(false);
              setPlaylistSheetVisible(true);
            },
          },
          {
            label: 'Album Details',
            icon: Info,
            onPress: () => {
              setMenuSheetVisible(false);
              setDetailsModalVisible(true);
            },
          },
        ];
      }
      case 'artist': {
        return [
          {
            label: 'Play Artist',
            icon: Play,
            onPress: () => handleArtistPlay(false),
          },
          {
            label: 'Shuffle Play',
            icon: Shuffle,
            onPress: () => handleArtistPlay(true),
          },
          {
            label: 'Artist Details',
            icon: Info,
            onPress: () => {
              setMenuSheetVisible(false);
              setDetailsModalVisible(true);
            },
          },
        ];
      }
      case 'playlist': {
        const playlist = selectedItem as Playlist;
        const isCustom = playlist.id.startsWith('custom-');
        const options: ActionSheetOption[] = [
          {
            label: 'Play Playlist',
            icon: Play,
            onPress: () => handlePlaylistPlay(false),
          },
          {
            label: 'Shuffle Play',
            icon: Shuffle,
            onPress: () => handlePlaylistPlay(true),
          },
        ];

        if (isCustom) {
          options.push(
            {
              label: 'Edit Playlist',
              icon: Pencil,
              onPress: () => {
                setMenuSheetVisible(false);
                setRenamePlaylistDialogVisible(true);
              },
            },
            {
              label: 'Add Songs',
              icon: Plus,
              onPress: () => {
                setMenuSheetVisible(false);
                setSongSheetVisible(true);
              },
            },
            {
              label: 'Delete Playlist',
              icon: Trash2,
              onPress: () => {
                setMenuSheetVisible(false);
                setDeleteConfirmVisible(true);
              },
              destructive: true,
            }
          );
        }

        options.push({
          label: 'Playlist Details',
          icon: Info,
          onPress: () => {
            setMenuSheetVisible(false);
            setDetailsModalVisible(true);
          },
        });

        return options;
      }
      default:
        return [];
    }
  }, [
    selectedItem,
    itemType,
    playlistId,
    handleSongFavorite,
    handleSongPlayNow,
    handleSongPlayNext,
    handleGoToAlbum,
    handleGoToArtist,
    handlePlaylistPlay,
    handleAlbumPlay,
    handleArtistPlay,
    handleRemoveFromPlaylist,
  ]);

  // Playlist Options Builder (Add to playlist sheet)
  const playlistOptions = useMemo((): ActionSheetOption[] => {
    const options: ActionSheetOption[] = [
      {
        label: 'Create New Playlist',
        icon: Plus,
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
        icon: getPlaylistIcon(p.icon),
        onPress: () => {
          if (itemType === 'song') {
            handleAddSongToPlaylistAction(p.id);
          } else if (itemType === 'album') {
            handleAddAlbumToPlaylist(p.id);
          }
        },
      });
    });

    return options;
  }, [playlists, itemType, handleAddSongToPlaylistAction, handleAddAlbumToPlaylist]);

  // Song Options Builder (Add songs to playlist sheet)
  const songOptions = useMemo((): ActionSheetOption[] => {
    if (itemType !== 'playlist' || !selectedItem) return [];
    const playlist = selectedItem as Playlist;
    const addableSongs = songs.filter((s) => !playlist.songIds.includes(s.id));

    return addableSongs.map((s) => ({
      label: s.title,
      icon: Music,
      onPress: async () => {
        await addSongToPlaylist(playlist.id, s.id);
        closeAll();
      },
    }));
  }, [itemType, selectedItem, songs, addSongToPlaylist, closeAll]);

  // Details Modal calculations
  const detailsData = useMemo((): { title: string; rows: { label: string; value: string }[] } | null => {
    if (!selectedItem || !itemType || itemType === 'song') return null;

    switch (itemType) {
      case 'album': {
        const album = selectedItem as Album;
        const albumSongs = getAlbumSongs();
        const duration = albumSongs.reduce((sum, s) => sum + s.duration, 0);
        return {
          title: 'Album Info',
          rows: [
            { label: 'Album', value: album.title },
            { label: 'Artist', value: album.artist },
            { label: 'Year', value: album.year?.toString() ?? 'Unknown' },
            { label: 'Genre', value: albumSongs[0]?.genre ?? 'Unknown' },
            { label: 'Songs', value: album.songCount.toString() },
            { label: 'Total Duration', value: formatTotalDuration(duration) },
          ],
        };
      }
      case 'artist': {
        const artist = selectedItem as Artist;
        const artistSongs = getArtistSongs();
        const plays = artistSongs.reduce((sum, s) => sum + (s.playCount ?? 0), 0);
        const time = artistSongs.reduce((sum, s) => sum + ((s.playCount ?? 0) * s.duration), 0);
        return {
          title: 'Artist Info',
          rows: [
            { label: 'Artist Name', value: artist.name },
            { label: 'Albums', value: artist.albumCount.toString() },
            { label: 'Songs', value: artist.songCount.toString() },
            { label: 'Total Plays', value: plays.toString() },
            { label: 'Total Listening Time', value: formatTotalDuration(time) },
          ],
        };
      }
      case 'playlist': {
        const playlist = selectedItem as Playlist;
        const playlistSongs = playlist.songIds
          .map((id) => songs.find((s) => s.id === id))
          .filter((s): s is Song => s !== undefined);
        const duration = playlistSongs.reduce((sum, s) => sum + s.duration, 0);
        return {
          title: 'Playlist Info',
          rows: [
            { label: 'Playlist Name', value: playlist.name },
            { label: 'Number of Songs', value: playlistSongs.length.toString() },
            { label: 'Total Duration', value: formatTotalDuration(duration) },
            { label: 'Created Date', value: new Date(playlist.createdAt).toLocaleDateString() },
            { label: 'Last Updated', value: new Date(playlist.updatedAt).toLocaleDateString() },
          ],
        };
      }
      default:
        return null;
    }
  }, [selectedItem, itemType, getAlbumSongs, getArtistSongs, songs]);

  const renderActionSheets = useCallback(() => {
    if (!selectedItem || !itemType) return null;

    const playlistName = itemType === 'playlist' ? (selectedItem as Playlist).name : '';

    return (
      <>
        {/* Main Action Sheet (Song/Album/Artist/Playlist) */}
        <ActionSheet
          visible={menuSheetVisible}
          onClose={closeAll}
          title={
            itemType === 'song'
              ? (selectedItem as Song).title
              : itemType === 'album'
                ? (selectedItem as Album).title
                : itemType === 'artist'
                  ? (selectedItem as Artist).name
                  : (selectedItem as Playlist).name
          }
          subtitle={
            itemType === 'song'
              ? (selectedItem as Song).artist
              : itemType === 'album'
                ? (selectedItem as Album).artist
                : itemType === 'artist'
                  ? `${(selectedItem as Artist).albumCount} albums • ${(selectedItem as Artist).songCount} songs`
                  : `${(selectedItem as Playlist).songIds.length} songs`
          }
          headerImage={
            itemType === 'song'
              ? (songArtwork || require('@/assets/images/default-album.png'))
              : itemType === 'playlist'
                ? getPlaylistIcon((selectedItem as Playlist).icon)
                : undefined
          }
          options={menuOptions}
        />

        {/* Add to Playlist Selector */}
        <ActionSheet
          visible={playlistSheetVisible}
          onClose={closeAll}
          title='Add to Playlist'
          subtitle='Select a playlist to add to'
          options={playlistOptions}
        />

        {/* Add Songs to Playlist Selector */}
        <ActionSheet
          visible={songSheetVisible}
          onClose={closeAll}
          title='Add Songs to Playlist'
          subtitle='Select a song to add'
          options={songOptions}
        />

        {/* Editor Dialog for new Playlist */}
        <PlaylistEditorDialog
          visible={newPlaylistDialogVisible}
          title='New Playlist'
          placeholder='Playlist Name'
          confirmLabel='Create'
          initialValue=''
          initialIconId='music'
          onClose={closeAll}
          onSubmit={handleCreatePlaylistAndAdd}
        />

        {/* Editor Dialog for editing Playlist */}
        <PlaylistEditorDialog
          visible={renamePlaylistDialogVisible}
          title='Edit Playlist'
          placeholder='Playlist Name'
          confirmLabel='Save'
          initialValue={playlistName}
          initialIconId={itemType === 'playlist' ? ((selectedItem as Playlist).icon || 'music') : 'music'}
          onClose={closeAll}
          onSubmit={handlePlaylistRename}
        />

        {/* Confirm Delete Dialog */}
        <ConfirmDialog
          visible={deleteConfirmVisible}
          title='Delete Playlist'
          description={`Are you sure you want to delete the playlist "${playlistName}"? This action cannot be undone.`}
          confirmLabel='Delete'
          cancelLabel='Cancel'
          isDestructive={true}
          onClose={closeAll}
          onConfirm={handlePlaylistDelete}
        />

        {/* Song Rich Details Modal */}
        {itemType === 'song' && (
          <SongDetailsModal
            visible={detailsModalVisible}
            song={selectedItem as Song}
            onClose={closeAll}
          />
        )}

        {/* Generic Entity Details Modal (Album/Artist/Playlist) */}
        {itemType !== 'song' && detailsData && (
          <DetailsModal
            visible={detailsModalVisible}
            title={detailsData.title}
            details={detailsData.rows}
            onClose={closeAll}
          />
        )}
      </>
    );
  }, [
    selectedItem,
    itemType,
    menuSheetVisible,
    playlistSheetVisible,
    songSheetVisible,
    newPlaylistDialogVisible,
    renamePlaylistDialogVisible,
    deleteConfirmVisible,
    detailsModalVisible,
    menuOptions,
    playlistOptions,
    songOptions,
    handleCreatePlaylistAndAdd,
    handlePlaylistRename,
    handlePlaylistDelete,
    detailsData,
    songArtwork,
    closeAll,
  ]);

  return {
    openMenu,
    renderActionSheets,
  };
}
