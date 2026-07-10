import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Theme } from '@/constants/theme';
import { usePlayer } from '@/hooks/usePlayer';
import { useLibraryStore } from '@/store/library.store';
import { useTheme } from '@/theme/useTheme';

export function PlayerInfo() {
  const { colors } = useTheme();
  const { currentSong } = usePlayer();
  const toggleFavorite = useLibraryStore((state) => state.toggleFavorite);

  if (!currentSong) {
    return null;
  }

  const isFavorite = currentSong.isFavorite;

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text numberOfLines={1} style={[styles.title, { color: colors.text }]}>
          {currentSong.title}
        </Text>

        <Text
          numberOfLines={1}
          style={[styles.artist, { color: colors.textSecondary }]}
        >
          {currentSong.artist}
        </Text>

        <Text
          numberOfLines={1}
          style={[styles.album, { color: colors.textSecondary }]}
        >
          {currentSong.album}
        </Text>
      </View>

      <Pressable
        hitSlop={10}
        onPress={() => toggleFavorite(currentSong.id)}
        android_ripple={{
          color: 'rgba(255,255,255,0.08)',
          borderless: true,
          radius: 24,
        }}
        style={styles.favoriteButton}
      >
        <Ionicons
          name={isFavorite ? 'heart' : 'heart-outline'}
          size={30}
          color={isFavorite ? '#ff453a' : colors.textSecondary}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.xl,
    marginBottom: Theme.spacing['2xl'],
  },

  textContainer: {
    flex: 1,
    marginRight: Theme.spacing.lg,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'left',
  },

  artist: {
    fontSize: 16,
    marginTop: Theme.spacing.xs,
    textAlign: 'left',
  },

  album: {
    fontSize: 14,
    marginTop: 2,
    opacity: 0.7,
    textAlign: 'left',
  },

  favoriteButton: {
    width: 48,
    height: 48,
    borderRadius: Theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
