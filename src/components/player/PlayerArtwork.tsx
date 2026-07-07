import { Image, StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { Theme } from '@/constants/theme';
import { usePlayer } from '@/hooks/usePlayer';
import { resolveArtworkSource } from '@/utils/assetResolver';

const DEFAULT_ARTWORK = require('@/assets/images/default-album.png');

export function PlayerArtwork() {
  const { currentSong } = usePlayer();

  return (
    <View style={styles.container}>
      <Image
        source={resolveArtworkSource(currentSong?.artwork) ?? DEFAULT_ARTWORK}
        resizeMode='cover'
        style={styles.image}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: Theme.spacing['2xl'],
    marginBottom: Theme.spacing['2xl'],
  },

  image: {
    width: 300,
    height: 300,
    borderRadius: 24,

    backgroundColor: Colors.dark.surfaceVariant,
  },
});
