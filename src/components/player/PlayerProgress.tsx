import Slider from '@react-native-community/slider';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Theme } from '@/constants/theme';
import { usePlayer } from '@/hooks/usePlayer';
import { useTheme } from '@/theme/useTheme';

function formatTime(seconds: number): string {
  const totalSeconds = Math.floor(seconds);

  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function PlayerProgress() {
  const { progress, seekTo } = usePlayer();
  const { colors } = useTheme();

  const [sliding, setSliding] = useState(false);
  const [slidingValue, setSlidingValue] = useState(0);

  const displayValue = sliding ? slidingValue : progress.position;

  return (
    <View style={styles.container}>
      <Slider
        minimumValue={0}
        maximumValue={progress.duration || 1}
        value={displayValue}
        minimumTrackTintColor={colors.primary}
        maximumTrackTintColor={colors.secondary}
        thumbTintColor={colors.primary}
        onSlidingStart={(value) => {
          setSliding(true);
          setSlidingValue(value);
        }}
        onValueChange={(value) => {
          setSlidingValue(value);
        }}
        onSlidingComplete={async (value) => {
          await seekTo(value);
          setSliding(false);
        }}
      />

      <View style={styles.timeContainer}>
        <Text style={[styles.time, { color: colors.textSecondary }]}>
          {formatTime(displayValue)}
        </Text>

        <Text style={[styles.time, { color: colors.textSecondary }]}>
          {formatTime(progress.duration)}
        </Text>
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
    fontSize: 12,
  },
});
