import { useLocalSearchParams } from 'expo-router';
import { FlatList, StyleSheet, View } from 'react-native';

import { DataState } from '@/components/common/DataState';
import { EmptyState } from '@/components/common/EmptyState';
import { PageLayout } from '@/components/common/PageLayout';
import { AlbumArtwork } from '@/components/music/AlbumArtwork';
import { SongCard } from '@/components/music/SongCard';

import { AppText } from '@/components/ui/AppText';

import { usePlayer } from '@/hooks/usePlayer';
import { useLibraryStore } from '@/store/library.store';

import { Song } from '@/types/music';

import { Theme } from '@/constants/theme';
import { useTheme } from '@/theme/useTheme';

export default function AlbumScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { play } = usePlayer();
  const { colors } = useTheme();

  const album = useLibraryStore((state) =>
    state.albums.find((a) => a.id === id)
  );

  const allSongs = useLibraryStore((state) => state.songs);
  const loading = useLibraryStore((state) => state.loading);
  const error = useLibraryStore((state) => state.error);

  const songs = allSongs
    .filter(
      (song) => song.album.trim().toLowerCase() === id?.trim().toLowerCase()
    )
    .sort((a, b) => {
      if (a.trackNumber != null && b.trackNumber != null) {
        return a.trackNumber - b.trackNumber;
      }

      return a.title.localeCompare(b.title);
    });

  const handleSongPress = async (song: Song) => {
    await play(song, songs);
  };

  if (!album && !loading) {
    return (
      <EmptyState
        icon='album'
        title='Album not found'
        description='This album could not be loaded.'
      />
    );
  }

  return (
    <PageLayout
      title={album?.title ?? 'Album'}
      subtitle={`${songs.length} ${songs.length === 1 ? 'song' : 'songs'}`}
    >
      <DataState
        loading={loading}
        error={error}
        isEmpty={songs.length === 0}
        empty={
          <EmptyState
            icon='album'
            title='No songs'
            description='This album has no songs.'
          />
        }
      >
        <FlatList
          data={songs}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            album && (
              <View style={styles.header}>
                <AlbumArtwork
                  songId={album.coverSongId}
                  title={album.title}
                  size='xl'
                />

                <AppText style={styles.title}>{album.title}</AppText>

                <AppText variant='body' color={colors.textSecondary}>
                  {album.artist}
                </AppText>

                <AppText variant='caption' color={colors.textSecondary}>
                  {album.year ?? 'Unknown Year'} • {album.songCount} songs
                </AppText>
              </View>
            )
          }
          renderItem={({ item }) => (
            <SongCard song={item} onPress={handleSongPress} />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        />
      </DataState>
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
});
