import { Alert, FlatList, StyleSheet, View } from 'react-native';

import { DataState } from '@/components/common/DataState';
import { EmptyState } from '@/components/common/EmptyState';
import { PageLayout } from '@/components/common/PageLayout';
import { ArtistCard } from '@/components/music/ArtistCard';
import { Theme } from '@/constants/theme';
import { useArtists } from '@/hooks/useArtists';
import { Artist } from '@/types/music';

export default function ArtistsScreen() {
  const { artists, loading, error, refresh } = useArtists();

  const handleArtistPress = (artist: Artist) => {
    // Artist details screen will be implemented later.
    Alert.alert('Artist', artist.name);
  };

  const handleMorePress = (artist: Artist) => {
    // Bottom sheet will be implemented later.
    Alert.alert('Options', artist.name);
  };

  return (
    <PageLayout
      title='Artists'
      subtitle={`${artists.length} ${
        artists.length === 1 ? 'artist' : 'artists'
      }`}
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
          data={artists}
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
