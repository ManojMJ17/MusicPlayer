import { Image, StyleSheet, View } from 'react-native';

import { Theme } from '@/constants/theme';
import { artworkService } from '@/services/artwork.service';
import { useTheme } from '@/theme/useTheme';
import { useEffect, useState } from 'react';

type ArtworkSize = 'sm' | 'md' | 'lg' | 'xl';

interface AlbumArtworkProps {
  songId?: string | null;
  title?: string;
  size?: ArtworkSize;
}

const DEFAULT_ARTWORK = require('@/assets/images/default-album.png');

const SIZE_MAP: Record<ArtworkSize, number> = {
  sm: 48,
  md: 64,
  lg: 96,
  xl: 120,
};

export function AlbumArtwork({
  songId,
  title,
  size = 'md',
}: AlbumArtworkProps) {
  const { colors } = useTheme();

  const dimension = SIZE_MAP[size];
  const [artwork, setArtwork] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadArtwork() {
      if (!songId) return;

      const image = await artworkService.getArtwork(songId);

      if (mounted) {
        setArtwork(image);
      }
    }

    loadArtwork();

    return () => {
      mounted = false;
    };
  }, [songId]);

  return (
    <View
      style={[
        styles.container,
        {
          width: dimension,
          height: dimension,
          borderRadius: Theme.radius.md,
          backgroundColor: colors.surfaceVariant,
        },
      ]}
    >
      <Image
        source={artwork ? { uri: artwork } : DEFAULT_ARTWORK}
        resizeMode='cover'
        style={{
          width: dimension,
          height: dimension,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },

  image: {
    width: '100%',
    height: '100%',
  },
});
