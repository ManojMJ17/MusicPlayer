import { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Theme } from '@/constants/theme';
import { usePlayer } from '@/hooks/usePlayer';
import { artworkService } from '@/services/artwork.service';
import { useTheme } from '@/theme/useTheme';

const DEFAULT_ARTWORK = require('@/assets/images/default-album.png');

export function PlayerArtwork() {
  const { colors } = useTheme();

  const { currentSong } = usePlayer();

  const [artwork, setArtwork] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadArtwork() {
      if (!currentSong) {
        setArtwork(null);
        return;
      }

      const image = await artworkService.getArtwork(currentSong.id);

      if (mounted) {
        setArtwork(image);
      }
    }

    loadArtwork();

    return () => {
      mounted = false;
    };
  }, [currentSong]);

  return (
    <View style={styles.container}>
      <Image
        source={artwork ? { uri: artwork } : DEFAULT_ARTWORK}
        resizeMode='cover'
        style={[
          styles.image,
          {
            backgroundColor: colors.surfaceVariant,
          },
        ]}
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
  },
});
