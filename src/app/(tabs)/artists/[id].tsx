import { useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Mic } from 'lucide-react-native';

import { DataState } from '@/components/common/DataState';
import { EmptyState } from '@/components/common/EmptyState';
import { PageLayout } from '@/components/common/PageLayout';
import { SongCard } from '@/components/music/SongCard';

import { AppText } from '@/components/ui/AppText';

import { usePlayer } from '@/hooks/usePlayer';
import { useSongActions } from '@/hooks/useSongActions';
import { useLibraryStore } from '@/store/library.store';

import { Song } from '@/types/music';

import { Theme } from '@/constants/theme';
import { useTheme } from '@/theme/useTheme';

export default function ArtistScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { play } = usePlayer();
  const { openMenu, renderActionSheets } = useSongActions();

  const artist = useLibraryStore((state) =>
    state.artists.find((a) => a.id === id)
  );

  const allSongs = useLibraryStore((state) => state.songs);
  const loading = useLibraryStore((state) => state.loading);
  const error = useLibraryStore((state) => state.error);

  const songs = allSongs
    .filter(
      (song) => song.artist.trim().toLowerCase() === id?.trim().toLowerCase()
    )
    .sort((a, b) => a.title.localeCompare(b.title));

  const handleSongPress = useCallback(async (song: Song) => {
    await play(song, songs);
  }, [play, songs]);

  if (!artist && !loading) {
    return (
      <EmptyState
        icon='mic'
        title='Artist not found'
        description='This artist could not be loaded.'
      />
    );
  }

  return (
    <PageLayout
      title={artist?.name ?? 'Artist'}
      subtitle={`${songs.length} ${songs.length === 1 ? 'song' : 'songs'}`}
    >
      <DataState
        loading={loading}
        error={error}
        isEmpty={songs.length === 0}
        empty={
          <EmptyState
            icon='mic'
            title='No songs'
            description='This artist has no songs.'
          />
        }
      >
        <FlatList
          data={songs}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            artist && (
              <View style={styles.header}>
                <View
                  style={[
                    styles.avatar,
                    {
                      backgroundColor: colors.surfaceVariant,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Mic size={60} color={colors.primary} />
                </View>
 
                <AppText style={styles.title}>{artist.name}</AppText>
 
                <AppText variant='body' color={colors.textSecondary}>
                  {artist.albumCount} Albums • {artist.songCount} Songs
                </AppText>
 
                <AppText variant='caption' color={colors.textSecondary}>
                  {artist.name} • {artist.albumCount} albums {artist.songCount}{' '}
                  songs
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
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,

    borderWidth: 1,

    justifyContent: 'center',
    alignItems: 'center',

    marginBottom: Theme.spacing.lg,
  },
});
