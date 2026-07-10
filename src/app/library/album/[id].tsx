import { useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Disc } from 'lucide-react-native';

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

export default function AlbumScreen() {
  const { colors } = useTheme();

  const { id } = useLocalSearchParams<{ id: string }>();

  const { play } = usePlayer();
  const { openMenu, renderActionSheets } = useSongActions();

  const songs = useLibraryStore((state) => state.songs).filter(
    (song) => song.album.trim().toLowerCase() === id?.trim().toLowerCase()
  );

  const album = songs[0]?.album ?? 'Album';
  const artist = songs[0]?.artist ?? 'Artist';

  const handleSongPress = useCallback(async (song: Song) => {
    await play(song, songs);
  }, [play, songs]);

  const loading = useLibraryStore((state) => state.loading);
  const error = useLibraryStore((state) => state.error);

  if (songs.length === 0 && !loading) {
    return (
      <EmptyState
        icon='album'
        title='Album not found'
        description='This album has no songs.'
      />
    );
  }

  return (
    <PageLayout title={album} subtitle={`${songs.length} songs`}>
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
                <Disc size={60} color={colors.primary} />
              </View>
              <AppText style={styles.title}>{album}</AppText>
              <AppText variant='body' color={colors.textSecondary}>
                {artist}
              </AppText>
              <AppText variant='caption' color={colors.textSecondary}>
                {songs.length} {songs.length === 1 ? 'song' : 'songs'}
              </AppText>
            </View>
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

  cover: {
    width: 200,
    height: 200,
    borderRadius: Theme.radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
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
