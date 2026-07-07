import Slider from '@react-native-community/slider';
import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { Theme } from '@/constants/theme';
import { usePlayer } from '@/hooks/usePlayer';

function formatTime(seconds: number): string {
  const totalSeconds = Math.floor(seconds);

  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function PlayerProgress() {
  const { progress, seekTo } = usePlayer();

  return (
    <View style={styles.container}>
      <Slider
        minimumValue={0}
        maximumValue={progress.duration || 1}
        value={progress.position}
        minimumTrackTintColor={Colors.dark.primary}
        maximumTrackTintColor={Colors.dark.border}
        thumbTintColor={Colors.dark.primary}
        onSlidingComplete={seekTo}
      />

      <View style={styles.timeContainer}>
        <Text style={styles.time}>{formatTime(progress.position)}</Text>

        <Text style={styles.time}>{formatTime(progress.duration)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Theme.spacing.xl,
    marginBottom: Theme.spacing.xl,
  },

  timeContainer: {
    marginTop: Theme.spacing.xs,

    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  time: {
    color: Colors.dark.textSecondary,
    fontSize: 12,
  },
});
