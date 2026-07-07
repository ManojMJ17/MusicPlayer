import { MaterialIcons } from '@expo/vector-icons';
import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';
import { Colors } from '@/constants/colors';
import { Theme } from '@/constants/theme';
import { Album } from '@/types/music';
import { AlbumArtwork } from './AlbumArtwork';

interface AlbumCardProps {
  album: Album;
  onPress: (album: Album) => void;
  onMorePress?: (album: Album) => void;
}

function AlbumCardComponent({ album, onPress, onMorePress }: AlbumCardProps) {
  return (
    <AppCard onPress={() => onPress(album)} contentStyle={styles.content}>
      <AlbumArtwork uri={album.artwork} title={album.title} size='md' />

      <View style={styles.info}>
        <AppText variant='body' numberOfLines={1} style={styles.title}>
          {album.title}
        </AppText>

        <AppText
          variant='bodySmall'
          color={Colors.dark.textSecondary}
          numberOfLines={1}
        >
          {album.artist}
        </AppText>

        <AppText variant='caption' color={Colors.dark.textSecondary}>
          {album.songCount} {album.songCount === 1 ? 'song' : 'songs'}
          {album.year ? ` • ${album.year}` : ''}
        </AppText>
      </View>

      <Pressable
        hitSlop={10}
        onPress={() => onMorePress?.(album)}
        android_ripple={{
          color: 'rgba(255,255,255,0.08)',
          borderless: true,
          radius: 20,
        }}
        style={styles.moreButton}
      >
        <MaterialIcons name='more-vert' size={22} color={Colors.dark.icon} />
      </Pressable>
    </AppCard>
  );
}

export const AlbumCard = memo(AlbumCardComponent);

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.md,
  },

  info: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    marginBottom: 2,
  },

  moreButton: {
    width: 40,
    height: 40,
    borderRadius: Theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
