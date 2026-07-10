import { Heart, MoreVertical } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Theme } from '@/constants/theme';
import { usePlayer } from '@/hooks/usePlayer';
import { useSongActions } from '@/hooks/useSongActions';
import { useLibraryStore } from '@/store/library.store';
import { useTheme } from '@/theme/useTheme';

export function PlayerInfo() {
  const { colors } = useTheme();
  const { currentSong } = usePlayer();
  const toggleFavorite = useLibraryStore((state) => state.toggleFavorite);
  const { openMenu, renderActionSheets } = useSongActions();

  if (!currentSong) {
    return null;
  }

  const isFavorite = currentSong.isFavorite;

  return (
    <>
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

        <View style={styles.actionsContainer}>
          <Pressable
            hitSlop={10}
            onPress={() => toggleFavorite(currentSong.id)}
            android_ripple={{
              color: 'rgba(255,255,255,0.08)',
              borderless: true,
              radius: 24,
            }}
            style={styles.actionButton}
          >
            <Heart
              size={26}
              color={isFavorite ? '#ff453a' : colors.textSecondary}
              fill={isFavorite ? '#ff453a' : 'transparent'}
            />
          </Pressable>

          <Pressable
            hitSlop={10}
            onPress={() => openMenu(currentSong)}
            android_ripple={{
              color: 'rgba(255,255,255,0.08)',
              borderless: true,
              radius: 24,
            }}
            style={styles.actionButton}
          >
            <MoreVertical
              size={26}
              color={colors.textSecondary}
            />
          </Pressable>
        </View>
      </View>
      {renderActionSheets()}
    </>
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
    fontSize: 22,
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

  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.xs,
  },

  actionButton: {
    width: 48,
    height: 48,
    borderRadius: Theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
