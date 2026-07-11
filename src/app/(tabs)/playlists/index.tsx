import { FlatList, StyleSheet, View } from 'react-native';

import { DataState } from '@/components/common/DataState';
import { EmptyState } from '@/components/common/EmptyState';
import { PageLayout } from '@/components/common/PageLayout';
import { PlaylistCard } from '@/components/music/PlaylistCard';
import { Theme } from '@/constants/theme';
import { usePlaylists } from '@/hooks/usePlaylists';
import { usePlaylistActions } from '@/hooks/useSongActions';
import { Playlist } from '@/types/music';
import { router } from 'expo-router';

export default function PlaylistsScreen() {
  const { playlists, loading, error, refresh } = usePlaylists();
  const { openMenu, renderActionSheets } = usePlaylistActions();

  const handlePlaylistPress = (playlist: Playlist) => {
    router.push({
      pathname: '/playlists/[id]',
      params: {
        id: playlist.id,
      },
    });
  };

  const handleMorePress = (playlist: Playlist) => {
    openMenu(playlist);
  };

  return (
    <PageLayout
      title='Playlists'
      subtitle={`${playlists.length} ${
        playlists.length === 1 ? 'playlist' : 'playlists'
      }`}
    >
      <DataState
        loading={loading}
        error={error}
        isEmpty={playlists.length === 0}
        empty={
          <EmptyState
            icon='queue-music'
            title='No playlists yet'
            description='Create your first playlist to organize your favorite songs.'
          />
        }
      >
        <FlatList
          data={playlists}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PlaylistCard
              playlist={item}
              onPress={handlePlaylistPress}
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
