import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { DataState } from '@/components/common/DataState';
import { EmptyState } from '@/components/common/EmptyState';
import { PageLayout } from '@/components/common/PageLayout';
import { SongCard } from '@/components/music/SongCard';

import { AppText } from '@/components/ui/AppText';

import { usePlayer } from '@/hooks/usePlayer';
import { libraryService } from '@/services/library.service';

import { Playlist, Song } from '@/types/music';

import { Theme } from '@/constants/theme';
import { useTheme } from '@/theme/useTheme';
import { MaterialIcons } from '@expo/vector-icons';

const descriptionMap: Record<string, string> = {
  'recently-added': 'Recently added to your device.',
  'recently-played': 'Your recently played songs.',
  'most-played': 'Your most played songs.',
};

export default function PlaylistScreen() {
  const { colors } = useTheme();

  const { id } = useLocalSearchParams<{ id: string }>();

  const { play } = usePlayer();

  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPlaylist() {
      try {
        const [playlistData, playlistSongs] = await Promise.all([
          libraryService.getPlaylist(id),
          libraryService.getPlaylistSongs(id),
        ]);

        setPlaylist(playlistData);
        setSongs(playlistSongs);
      } catch {
        setError('Failed to load playlist');
      } finally {
        setLoading(false);
      }
    }

    loadPlaylist();
  }, [id]);

  const handleSongPress = async (song: Song) => {
    await play(song, songs);
  };

  if (!playlist && !loading) {
    return (
      <EmptyState
        icon='queue-music'
        title='Playlist not found'
        description='This playlist could not be loaded.'
      />
    );
  }

  return (
    <PageLayout
      title={playlist?.name ?? 'Playlist'}
      subtitle={`${songs.length} ${songs.length === 1 ? 'song' : 'songs'}`}
    >
      <DataState
        loading={loading}
        error={error}
        isEmpty={songs.length === 0}
        empty={
          <EmptyState
            icon='queue-music'
            title='No songs'
            description='This playlist has no songs.'
          />
        }
      >
        <FlatList
          data={songs}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            playlist && (
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
                  <MaterialIcons
                    name='queue-music'
                    size={60}
                    color={colors.primary}
                  />
                </View>
                <AppText style={styles.title}>{playlist.name}</AppText>

                <AppText variant='body' color={colors.textSecondary}>
                  {playlist
                    ? (descriptionMap[playlist.id] ?? 'Smart Playlist')
                    : ''}
                </AppText>

                <AppText variant='caption' color={colors.textSecondary}>
                  {songs.length} {songs.length === 1 ? 'song' : 'songs'}
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

  cover: {
    width: 120,
    height: 120,
    borderRadius: Theme.radius.xl,

    justifyContent: 'center',
    alignItems: 'center',

    marginBottom: Theme.spacing.lg,
  },
});
