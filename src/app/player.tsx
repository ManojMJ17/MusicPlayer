import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { PlayerArtwork } from '@/components/player/PlayerArtwork';
import { PlayerControls } from '@/components/player/PlayerControls';
import { PlayerInfo } from '@/components/player/PlayerInfo';
import { PlayerProgress } from '@/components/player/PlayerProgress';
import { Colors } from '@/constants/colors';
import { Theme } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PlayerScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name='chevron-down' size={28} color={Colors.dark.text} />
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
    backgroundColor: Colors.dark.background,
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
