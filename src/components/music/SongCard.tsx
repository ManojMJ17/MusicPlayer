import { MaterialIcons } from '@expo/vector-icons';
import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';
import { Colors } from '@/constants/colors';
import { Theme } from '@/constants/theme';
import { Song } from '@/types/music';

interface SongCardProps {
  song: Song;
  onPress: (song: Song) => void;
  onMorePress?: (song: Song) => void;
}

function SongCardComponent({ song, onPress, onMorePress }: SongCardProps) {
  return (
    <AppCard onPress={() => onPress(song)} contentStyle={styles.content}>
      <View style={styles.info}>
        <AppText variant='body' numberOfLines={1} style={styles.title}>
          {song.title}
        </AppText>

        <AppText
          variant='bodySmall'
          color={Colors.dark.textSecondary}
          numberOfLines={1}
        >
          {song.artist} - {song.album}
        </AppText>
      </View>

      <Pressable
        hitSlop={10}
        onPress={() => onMorePress?.(song)}
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

export const SongCard = memo(SongCardComponent);

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
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
