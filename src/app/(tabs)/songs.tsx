import { Alert, FlatList, StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/common/EmptyState';
import { Screen } from '@/components/common/Screen';
import { SongCard } from '@/components/music/SongCard';
import { AppText } from '@/components/ui/AppText';
import { Theme } from '@/constants/theme';
import { useSongs } from '@/hooks/useSongs';
import { Song } from '@/types/music';

export default function SongsScreen() {
  const { songs, loading, error, refresh } = useSongs();

  const handleSongPress = (song: Song) => {
    // Playback will be implemented in Phase 3.
    Alert.alert('Play Song', song.title);
  };

  const handleMorePress = (song: Song) => {
    // Bottom sheet will be implemented later.
    Alert.alert('Options', song.title);
  };

  if (loading) {
    return (
      <Screen>
        <View style={styles.center}>
          <AppText>Loading songs...</AppText>
        </View>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <EmptyState
          icon='error-outline'
          title='Something went wrong'
          description={error}
        />
      </Screen>
    );
  }

  if (songs.length === 0) {
    return (
      <Screen>
        <EmptyState
          title='No songs found'
          description='Your music library is empty.'
        />
      </Screen>
    );
  }

  return (
    <Screen>
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
        contentContainerStyle={styles.content}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={refresh}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: Theme.spacing.lg,
  },

  separator: {
    height: Theme.spacing.md,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
