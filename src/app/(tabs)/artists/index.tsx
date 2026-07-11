import { FlatList, StyleSheet, View } from 'react-native';

import { DataState } from '@/components/common/DataState';
import { EmptyState } from '@/components/common/EmptyState';
import { IconButton } from '@/components/common/IconButton';
import { PageLayout } from '@/components/common/PageLayout';
import SearchBar from '@/components/common/SearchBar';
import { ArtistCard } from '@/components/music/ArtistCard';
import { Theme } from '@/constants/theme';
import { useArtists } from '@/hooks/useArtists';
import { useSearch } from '@/hooks/useSearch';
import { useArtistActions } from '@/hooks/useSongActions';
import { Artist } from '@/types/music';
import { router } from 'expo-router';
import { Search } from 'lucide-react-native';
import { useState } from 'react';

export default function ArtistsScreen() {
  const [isSearching, setIsSearching] = useState(false);

  const { artists, loading, error, refresh } = useArtists();
  const { openMenu, renderActionSheets } = useArtistActions();

  const { query, setQuery, clearQuery, filteredItems } = useSearch(
    artists,
    (artist) => [artist.name],
  );

  const handleArtistPress = (artist: Artist) => {
    router.push({
      pathname: '/artists/[id]',
      params: {
        id: artist.id,
      },
    });
  };

  const handleMorePress = (artist: Artist) => {
    openMenu(artist);
  };

  return (
    <PageLayout
      header={
        isSearching ? (
          <SearchBar
            value={query}
            placeholder='Search Artist...'
            onChangeText={setQuery}
            onClose={() => {
              clearQuery();
              setIsSearching(false);
            }}
          />
        ) : undefined
      }
      title='Artists'
      subtitle={`${artists.length} Artists`}
      headerRight={
        <IconButton icon={Search} onPress={() => setIsSearching(true)} />
      }
    >
      <DataState
        loading={loading}
        error={error}
        isEmpty={artists.length === 0}
        empty={
          <EmptyState
            icon='person'
            title='No artists found'
            description='Artists will appear here after your music library is scanned.'
          />
        }
      >
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ArtistCard
              artist={item}
              onPress={handleArtistPress}
              onMorePress={handleMorePress}
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={refresh}
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
