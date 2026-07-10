import { Play, Pause, SkipBack, SkipForward } from 'lucide-react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Theme } from '@/constants/theme';
import { usePlayer } from '@/hooks/usePlayer';
import { artworkService } from '@/services/artwork.service';
import { useTheme } from '@/theme/useTheme';

const DEFAULT_ARTWORK = require('@/assets/images/default-album.png');

export function MiniPlayer() {
  const { colors } = useTheme();

  const { currentSong, isPlaying, pause, resume, next, previous } = usePlayer();

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

  if (!currentSong) {
    return null;
  }

  const handlePlayPause = async () => {
    if (isPlaying) {
      await pause();
    } else {
      await resume();
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        pressed && styles.pressed,
      ]}
      onPress={() => router.push('/player')}
    >
      <Image
        source={artwork ? { uri: artwork } : DEFAULT_ARTWORK}
        style={[
          styles.artwork,
          {
            backgroundColor: colors.surfaceVariant,
          },
        ]}
      />

      <View style={styles.info}>
        <Text
          numberOfLines={1}
          style={[
            styles.title,
            {
              color: colors.text,
            },
          ]}
        >
          {currentSong.title}
        </Text>

        <Text
          numberOfLines={1}
          style={[
            styles.artist,
            {
              color: colors.textSecondary,
            },
          ]}
        >
          {currentSong.artist}
        </Text>
      </View>

      <Pressable onPress={previous} style={styles.iconButton}>
        <SkipBack size={22} color={colors.text} fill={colors.text} />
      </Pressable>

      <Pressable onPress={handlePlayPause} style={styles.iconButton}>
        {isPlaying ? (
          <Pause size={24} color={colors.text} fill={colors.text} />
        ) : (
          <Play size={24} color={colors.text} fill={colors.text} />
        )}
      </Pressable>

      <Pressable onPress={next} style={styles.iconButton}>
        <SkipForward size={22} color={colors.text} fill={colors.text} />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',

    left: 0,
    right: 0,

    bottom: 64,

    height: 72,

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: Theme.spacing.lg,

    borderTopWidth: StyleSheet.hairlineWidth,

    zIndex: 999,
    elevation: 20,
  },

  pressed: {
    opacity: 0.92,
  },

  artwork: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginRight: Theme.spacing.md,
  },

  info: {
    flex: 1,
  },

  title: {
    fontSize: 15,
    fontWeight: '600',
  },

  artist: {
    fontSize: 13,
    marginTop: 2,
  },

  iconButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
