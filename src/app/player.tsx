import { ChevronDown } from 'lucide-react-native';
import { router } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { PlayerArtwork } from '@/components/player/PlayerArtwork';
import { PlayerControls } from '@/components/player/PlayerControls';
import { PlayerInfo } from '@/components/player/PlayerInfo';
import { PlayerProgress } from '@/components/player/PlayerProgress';
import { Theme } from '@/constants/theme';
import { useTheme } from '@/theme/useTheme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PlayerScreen() {
  const { colors } = useTheme();
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <ChevronDown size={28} color={colors.text} />
      </Pressable>

      <PlayerArtwork />

      <PlayerInfo />

      <PlayerProgress />

      <PlayerControls />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    paddingHorizontal: Theme.spacing.lg,
  },

  backButton: {
    width: 44,
    height: 44,

    justifyContent: 'center',
    alignItems: 'center',

    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
  },
});
