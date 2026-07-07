import { MaterialIcons } from '@expo/vector-icons';
import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';
import { Colors } from '@/constants/colors';
import { Theme } from '@/constants/theme';
import { Playlist } from '@/types/music';

interface PlaylistCardProps {
  playlist: Playlist;
  onPress: (playlist: Playlist) => void;
  onMorePress?: (playlist: Playlist) => void;
}

function PlaylistCardComponent({
  playlist,
  onPress,
  onMorePress,
}: PlaylistCardProps) {
  const songCount = playlist.songIds.length;

  return (
    <AppCard onPress={() => onPress(playlist)} contentStyle={styles.content}>
      <View style={styles.cover}>
        <MaterialIcons
          name='queue-music'
          size={32}
          color={Colors.dark.primary}
        />
      </View>

      <View style={styles.info}>
        <AppText variant='body' numberOfLines={1} style={styles.title}>
          {playlist.name}
        </AppText>

        <AppText
          variant='bodySmall'
          color={Colors.dark.textSecondary}
          numberOfLines={1}
        >
          {songCount} {songCount === 1 ? 'song' : 'songs'}
        </AppText>
      </View>

      <Pressable
        hitSlop={10}
        onPress={() => onMorePress?.(playlist)}
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

export const PlaylistCard = memo(PlaylistCardComponent);

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.md,
  },

  cover: {
    width: 64,
    height: 64,
    borderRadius: Theme.radius.md,
    backgroundColor: Colors.dark.surfaceVariant,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    alignItems: 'center',
    justifyContent: 'center',
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
