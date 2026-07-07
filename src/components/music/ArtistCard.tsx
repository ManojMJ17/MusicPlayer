import { MaterialIcons } from '@expo/vector-icons';
import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';
import { Colors } from '@/constants/colors';
import { Theme } from '@/constants/theme';
import { Artist } from '@/types/music';

interface ArtistCardProps {
  artist: Artist;
  onPress: (artist: Artist) => void;
  onMorePress?: (artist: Artist) => void;
}

function ArtistCardComponent({
  artist,
  onPress,
  onMorePress,
}: ArtistCardProps) {
  return (
    <AppCard onPress={() => onPress(artist)} contentStyle={styles.content}>
      <View style={styles.avatar}>
        <MaterialIcons name='person' size={32} color={Colors.dark.primary} />
      </View>

      <View style={styles.info}>
        <AppText variant='body' numberOfLines={1} style={styles.name}>
          {artist.name}
        </AppText>

        <AppText variant='bodySmall' color={Colors.dark.textSecondary}>
          {artist.albumCount} {artist.albumCount === 1 ? 'album' : 'albums'} •{' '}
          {artist.songCount} {artist.songCount === 1 ? 'song' : 'songs'}
        </AppText>
      </View>

      <Pressable
        hitSlop={10}
        onPress={() => onMorePress?.(artist)}
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

export const ArtistCard = memo(ArtistCardComponent);

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.md,
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: Theme.radius.full,
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

  name: {
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
