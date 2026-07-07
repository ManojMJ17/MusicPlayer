import { FlatList, StyleSheet, View } from 'react-native';

import { DataState } from '@/components/common/DataState';
import { EmptyState } from '@/components/common/EmptyState';
import { PageLayout } from '@/components/common/PageLayout';
import { SongCard } from '@/components/music/SongCard';
import { Theme } from '@/constants/theme';
import { usePlayer } from '@/hooks/usePlayer';
import { useSongs } from '@/hooks/useSongs';
import { Song } from '@/types/music';

export default function SongsScreen() {
  const { songs, loading, error, refresh } = useSongs();

  const { play } = usePlayer();

  const handleSongPress = async (song: Song) => {
    await play(song, songs);
  };
  const handleMorePress = (song: Song) => {};

  return (
    <PageLayout
      title='Songs'
      subtitle={`${songs.length} ${songs.length === 1 ? 'song' : 'songs'}`}
    >
      <DataState
        loading={loading}
        error={error}
        isEmpty={songs.length === 0}
        empty={
          <EmptyState
            icon='music-note'
            title='No Songs Found'
            description='No audio files were found on your device.'
          />
        }
      >
        <FlatList
          data={songs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SongCard
              song={item}
              onPress={handleSongPress}
              onMorePress={handleMorePress}
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.content}
          refreshing={loading}
          onRefresh={refresh}
          showsVerticalScrollIndicator={false}
        />
      </DataState>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: Theme.spacing['4xl'],
  },

  separator: {
    height: Theme.spacing.md,
  },

  permissionButton: {
    marginTop: Theme.spacing.xl,
  },
});
