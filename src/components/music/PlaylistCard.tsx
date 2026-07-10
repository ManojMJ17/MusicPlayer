import { MaterialIcons } from '@expo/vector-icons';
import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';
import { Theme } from '@/constants/theme';
import { useTheme } from '@/theme/useTheme';
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

  const { colors } = useTheme();

  return (
    <AppCard onPress={() => onPress(playlist)} contentStyle={styles.content}>
      <View
        style={[
          styles.cover,
          {
            backgroundColor: colors.surfaceVariant,
            borderColor: colors.border,
            borderWidth: 1,
          },
        ]}
      >
        <MaterialIcons name='queue-music' size={32} color={colors.primary} />
      </View>

      <View style={styles.info}>
        <AppText variant='body' numberOfLines={1} style={styles.title}>
          {playlist.name}
        </AppText>

        <AppText
          variant='bodySmall'
          color={colors.textSecondary}
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
        <MaterialIcons name='more-vert' size={22} color={colors.icon} />
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
