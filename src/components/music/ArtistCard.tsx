import { MoreVertical, UserRound } from 'lucide-react-native';
import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';
import { Theme } from '@/constants/theme';
import { useTheme } from '@/theme/useTheme';
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
  const { colors } = useTheme();

  return (
    <AppCard onPress={() => onPress(artist)} contentStyle={styles.content}>
      <View
        style={[
          styles.avatar,
          {
            backgroundColor: colors.surfaceVariant,
            borderColor: colors.border,
          },
        ]}
      >
        <UserRound size={30} strokeWidth={2} color={colors.primary} />
      </View>

      <View style={styles.info}>
        <AppText variant='body' numberOfLines={1} style={styles.name}>
          {artist.name}
        </AppText>

        <AppText variant='bodySmall' color={colors.textSecondary}>
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
        <MoreVertical size={22} color={colors.icon} />
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
    borderWidth: 1,
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
