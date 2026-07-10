import { DataState } from '@/components/common/DataState';
import { EmptyState } from '@/components/common/EmptyState';
import { IconButton } from '@/components/common/IconButton';
import { PageLayout } from '@/components/common/PageLayout';
import SearchBar from '@/components/common/SearchBar';
import { SongCard } from '@/components/music/SongCard';
import { Theme } from '@/constants/theme';
import { usePlayer } from '@/hooks/usePlayer';
import { useSearch } from '@/hooks/useSearch';
import { useSongActions } from '@/hooks/useSongActions';
import { useSongs } from '@/hooks/useSongs';
import { Song } from '@/types/music';
import { songSearchFields } from '@/utils/searchSelectors';
import { Search } from 'lucide-react-native';
import { useState, useCallback } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

export default function SongsScreen() {
  const [isSearching, setIsSearching] = useState(false);

  const { songs, loading, error, refresh } = useSongs();

  const { play } = usePlayer();
  const { openMenu, renderActionSheets } = useSongActions();

  const {
    query,
    setQuery,
    clearQuery,
    filteredItems: filteredSongs,
  } = useSearch(songs, songSearchFields);

  const handleSongPress = useCallback(async (song: Song) => {
    await play(song, songs);
  }, [play, songs]);

  return (
    <PageLayout
      header={
        isSearching ? (
          <SearchBar
            value={query}
            placeholder='Search songs...'
            onChangeText={setQuery}
            onClose={() => {
              clearQuery();
              setIsSearching(false);
            }}
          />
        ) : undefined
      }
      title='Songs'
      subtitle={`${songs.length} songs`}
      headerRight={
        <IconButton icon={Search} onPress={() => setIsSearching(true)} />
      }
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
          data={filteredSongs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SongCard
              song={item}
              onPress={handleSongPress}
              onMorePress={openMenu}
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.content}
          refreshing={loading}
          onRefresh={refresh}
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
