import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { DataState } from '@/components/common/DataState';
import { EmptyState } from '@/components/common/EmptyState';
import { PageLayout } from '@/components/common/PageLayout';
import { SongCard } from '@/components/music/SongCard';

import { AppText } from '@/components/ui/AppText';

import { usePlayer } from '@/hooks/usePlayer';
import { useSongActions } from '@/hooks/useSongActions';
import { useLibraryStore } from '@/store/library.store';

import { Song } from '@/types/music';

import { getPlaylistIcon } from '@/constants/playlist-icons';
import { Theme } from '@/constants/theme';
import { useTheme } from '@/theme/useTheme';

const descriptionMap: Record<string, string> = {
  'recently-added': 'Recently added to your device.',
  'recently-played': 'Your recently played songs.',
  'most-played': 'Your most played songs.',
  'favorites': 'Your favorite songs.',
};

export default function PlaylistScreen() {
  const { colors } = useTheme();

  const { id } = useLocalSearchParams<{ id: string }>();

  const { play } = usePlayer();
  const { openMenu, renderActionSheets } = useSongActions(id);

  const playlist = useLibraryStore((state) =>
    state.playlists.find((p) => p.id === id)
  );

  const allSongs = useLibraryStore((state) => state.songs);
  const loading = useLibraryStore((state) => state.loading);
  const error = useLibraryStore((state) => state.error);

  const songs = useMemo(() => {
    return playlist
      ? playlist.songIds
        .map((songId) => allSongs.find((s) => s.id === songId))
        .filter((song): song is Song => song !== undefined)
      : [];
  }, [playlist, allSongs]);

  const handleSongPress = useCallback(async (song: Song) => {
    await play(song, songs);
  }, [play, songs]);

  if (!playlist && !loading) {
    return (
      <EmptyState
        icon='music'
        title='Playlist not found'
        description='This playlist could not be loaded.'
      />
    );
  }

  return (
    <PageLayout
      title={playlist?.name ?? 'Playlist'}
      subtitle={`${songs.length} ${songs.length === 1 ? 'song' : 'songs'}`}
    >
      <DataState
        loading={loading}
        error={error}
        isEmpty={songs.length === 0}
        empty={
          <EmptyState
            icon='music'
            title='No songs'
            description='This playlist has no songs.'
          />
        }
      >
        <FlatList
          data={songs}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            playlist && (
              <View style={styles.header}>
                <View
                  style={[
                    styles.cover,
                    {
                      backgroundColor: colors.surfaceVariant,
                      borderWidth: 1,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  {React.createElement(getPlaylistIcon(playlist.icon), {
                    size: 60,
                    color: colors.primary,
                  })}
                </View>
                <AppText style={styles.title}>{playlist.name}</AppText>

                <AppText variant='body' color={colors.textSecondary}>
                  {playlist
                    ? (descriptionMap[playlist.id] ?? 'Smart Playlist')
                    : ''}
                </AppText>

                <AppText variant='caption' color={colors.textSecondary}>
                  {songs.length} {songs.length === 1 ? 'song' : 'songs'}
                </AppText>
              </View>
            )
          }
          renderItem={({ item }) => (
            <SongCard
              song={item}
              onPress={handleSongPress}
              onMorePress={openMenu}
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={5}
          initialNumToRender={12}
        />
      </DataState>
      {renderActionSheets()}
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: Theme.spacing['2xl'],
  },

  title: {
    marginTop: Theme.spacing.lg,
  },

  separator: {
    height: Theme.spacing.md,
  },

  content: {
    paddingBottom: Theme.spacing['4xl'],
  },

  cover: {
    width: 120,
    height: 120,
    borderRadius: Theme.radius.xl,

    justifyContent: 'center',
    alignItems: 'center',

    marginBottom: Theme.spacing.lg,
  },
});
