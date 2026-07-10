import { FlatList, StyleSheet, View } from 'react-native';

import { DataState } from '@/components/common/DataState';
import { EmptyState } from '@/components/common/EmptyState';
import { IconButton } from '@/components/common/IconButton';
import { PageLayout } from '@/components/common/PageLayout';
import SearchBar from '@/components/common/SearchBar';
import { AlbumCard } from '@/components/music/AlbumCard';
import { Theme } from '@/constants/theme';
import { useAlbums } from '@/hooks/useAlbums';
import { useSearch } from '@/hooks/useSearch';
import { useAlbumActions } from '@/hooks/useSongActions';
import { Album } from '@/types/music';
import { router } from 'expo-router';
import { Search } from 'lucide-react-native';
import { useState } from 'react';

export default function AlbumsScreen() {
  const [isSearching, setIsSearching] = useState(false);

  const { albums, loading, error, refresh } = useAlbums();
  const { openMenu, renderActionSheets } = useAlbumActions();

  const { query, setQuery, clearQuery, filteredItems } = useSearch(
    albums,
    (album) => [album.title, album.artist],
  );

  const handleAlbumPress = (album: Album) => {
    router.push({
      pathname: '/library/album/[id]',
      params: {
        id: album.id,
      },
    });
  };

  const handleMorePress = (album: Album) => {
    openMenu(album);
  };

  return (
    <PageLayout
      header={
        isSearching ? (
          <SearchBar
            value={query}
            placeholder='Search Albums...'
            onChangeText={setQuery}
            onClose={() => {
              clearQuery();
              setIsSearching(false);
            }}
          />
        ) : undefined
      }
      title='Albums'
      subtitle={`${albums.length} Albums`}
      headerRight={
        <IconButton icon={Search} onPress={() => setIsSearching(true)} />
      }
    >
      <DataState
        loading={loading}
        error={error}
        isEmpty={albums.length === 0}
        empty={
          <EmptyState
            icon='album'
            title='No albums found'
            description="Your music library doesn't contain any albums yet."
          />
        }
      >
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AlbumCard
              album={item}
              onPress={handleAlbumPress}
              onMorePress={handleMorePress}
            />
          )}
          contentContainerStyle={styles.content}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          refreshing={loading}
          onRefresh={refresh}
          showsVerticalScrollIndicator={false}
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
});
