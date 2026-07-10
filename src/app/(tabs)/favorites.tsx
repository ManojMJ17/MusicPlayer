import { DataState } from '@/components/common/DataState';
import { EmptyState } from '@/components/common/EmptyState';
import { IconButton } from '@/components/common/IconButton';
import { PageLayout } from '@/components/common/PageLayout';
import SearchBar from '@/components/common/SearchBar';
import { SongCard } from '@/components/music/SongCard';
import { Theme } from '@/constants/theme';
import { usePlayer } from '@/hooks/usePlayer';
import { useSearch } from '@/hooks/useSearch';
import { useLibraryStore } from '@/store/library.store';
import { Song } from '@/types/music';
import { songSearchFields } from '@/utils/searchSelectors';
import { Search } from 'lucide-react-native';
import { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

export default function FavoritesScreen() {
  const [isSearching, setIsSearching] = useState(false);

  const songs = useLibraryStore((state) => state.songs);
  const loading = useLibraryStore((state) => state.loading);
  const error = useLibraryStore((state) => state.error);
  const refresh = useLibraryStore((state) => state.refreshLibrary);

  const favoriteSongs = songs.filter((song) => song.isFavorite);

  const { play } = usePlayer();

  const {
    query,
    setQuery,
    clearQuery,
    filteredItems: filteredSongs,
  } = useSearch(favoriteSongs, songSearchFields);

  const handleSongPress = async (song: Song) => {
    await play(song, favoriteSongs);
  };

  const handleMorePress = (song: Song) => {};

  return (
    <PageLayout
      header={
        isSearching ? (
          <SearchBar
            value={query}
            placeholder='Search favorites...'
            onChangeText={setQuery}
            onClose={() => {
              clearQuery();
              setIsSearching(false);
            }}
          />
        ) : undefined
      }
      title='Favorites'
      subtitle={`${favoriteSongs.length} ${favoriteSongs.length === 1 ? 'song' : 'songs'}`}
      headerRight={
        favoriteSongs.length > 0 ? (
          <IconButton icon={Search} onPress={() => setIsSearching(true)} />
        ) : undefined
      }
    >
      <DataState
        loading={loading}
        error={error}
        isEmpty={favoriteSongs.length === 0}
        empty={
          <EmptyState
            icon='favorite-border'
            title='No Favorites Yet'
            description='Songs you mark with a heart will appear here.'
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
});
