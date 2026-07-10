import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { Theme } from '@/constants/theme';
import { usePlayer } from '@/hooks/usePlayer';
import { artworkService } from '@/services/artwork.service';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';

const DEFAULT_ARTWORK = require('@/assets/images/default-album.png');

export function MiniPlayer() {
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
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={() => router.push('/player')}
    >
      <Image
        source={artwork ? { uri: artwork } : DEFAULT_ARTWORK}
        style={styles.artwork}
      />

      <View style={styles.info}>
        <Text numberOfLines={1} style={styles.title}>
          {currentSong.title}
        </Text>

        <Text numberOfLines={1} style={styles.artist}>
          {currentSong.artist}
        </Text>
      </View>

      <Pressable onPress={previous} style={styles.iconButton}>
        <Ionicons name='play-skip-back' size={22} color={Colors.dark.text} />
      </Pressable>

      <Pressable onPress={handlePlayPause} style={styles.iconButton}>
        <Ionicons
          name={isPlaying ? 'pause' : 'play'}
          size={24}
          color={Colors.dark.text}
        />
      </Pressable>

      <Pressable onPress={next} style={styles.iconButton}>
        <Ionicons name='play-skip-forward' size={22} color={Colors.dark.text} />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',

    left: 0,
    right: 0,

    bottom: 64, // same height as your tab bar

    height: 72,

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: Theme.spacing.lg,

    backgroundColor: Colors.dark.surface,

    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.dark.border,

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
    backgroundColor: Colors.dark.surfaceVariant,
  },

  info: {
    flex: 1,
  },

  title: {
    color: Colors.dark.text,
    fontSize: 15,
    fontWeight: '600',
  },

  artist: {
    color: Colors.dark.textSecondary,
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
