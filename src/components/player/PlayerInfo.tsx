import { StyleSheet, Text, View } from 'react-native';

import { Theme } from '@/constants/theme';
import { usePlayer } from '@/hooks/usePlayer';
import { useTheme } from '@/theme/useTheme';

export function PlayerInfo() {
  const { colors } = useTheme();
  const { currentSong } = usePlayer();

  if (!currentSong) {
    return null;
  }


  return (
    <View style={styles.container}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.xl,
    marginBottom: Theme.spacing['2xl'],
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },

  artist: {
    fontSize: 16,
    marginTop: Theme.spacing.sm,
  },

  album: {
    fontSize: 14,
    marginTop: 4,
    opacity: 0.7,
  },
});
