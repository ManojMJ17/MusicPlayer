import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { Theme } from '@/constants/theme';
import { usePlayer } from '@/hooks/usePlayer';

export function PlayerInfo() {
  const { currentSong } = usePlayer();

  if (!currentSong) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text numberOfLines={1} style={styles.title}>
        {currentSong.title}
      </Text>

      <Text numberOfLines={1} style={styles.artist}>
        {currentSong.artist}
      </Text>

      <Text numberOfLines={1} style={styles.album}>
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
    color: Colors.dark.text,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },

  artist: {
    color: Colors.dark.textSecondary,
    fontSize: 16,
    marginTop: Theme.spacing.sm,
  },

  album: {
    color: Colors.dark.textSecondary,
    fontSize: 14,
    marginTop: 4,
    opacity: 0.7,
  },
});
