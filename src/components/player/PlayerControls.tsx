import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { Theme } from '@/constants/theme';
import { usePlayer } from '@/hooks/usePlayer';

export function PlayerControls() {
  const {
    isPlaying,
    pause,
    resume,
    previous,
    next,
    shuffleEnabled,
    repeatMode,
    toggleShuffle,
    cycleRepeatMode,
  } = usePlayer();

  const handlePlayPause = async () => {
    if (isPlaying) {
      await pause();
    } else {
      await resume();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.secondaryControls}>
        <Pressable onPress={toggleShuffle} style={styles.smallButton}>
          <Ionicons
            name='shuffle'
            size={22}
            color={
              shuffleEnabled ? Colors.dark.primary : Colors.dark.textSecondary
            }
          />
        </Pressable>

        <Pressable onPress={previous} style={styles.mainButton}>
          <Ionicons name='play-skip-back' size={30} color={Colors.dark.text} />
        </Pressable>

        <Pressable onPress={handlePlayPause} style={styles.playButton}>
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={34}
            color={Colors.dark.background}
          />
        </Pressable>

        <Pressable onPress={next} style={styles.mainButton}>
          <Ionicons
            name='play-skip-forward'
            size={30}
            color={Colors.dark.text}
          />
        </Pressable>

        <Pressable onPress={cycleRepeatMode} style={styles.smallButton}>
          <Ionicons
            name={repeatMode === 'one' ? 'repeat-outline' : 'repeat'}
            size={22}
            color={
              repeatMode === 'off'
                ? Colors.dark.textSecondary
                : Colors.dark.primary
            }
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Theme.spacing.xl,
  },

  secondaryControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  smallButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },

  mainButton: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },

  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,

    backgroundColor: Colors.dark.primary,

    justifyContent: 'center',
    alignItems: 'center',
  },
});
