import { Image, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Colors } from '@/constants/colors';
import { Theme } from '@/constants/theme';
type ArtworkSize = 'sm' | 'md' | 'lg' | 'xl';

interface AlbumArtworkProps {
  uri?: string | null;
  title?: string;
  size?: ArtworkSize;
}

const SIZE_MAP: Record<ArtworkSize, number> = {
  sm: 48,
  md: 64,
  lg: 96,
  xl: 180,
};

export function AlbumArtwork({ uri, title, size = 'md' }: AlbumArtworkProps) {
  const dimension = SIZE_MAP[size];

  if (!uri) {
    return (
      <View
        style={[
          styles.placeholder,
          {
            width: dimension,
            height: dimension,
            borderRadius: Theme.radius.md,
          },
        ]}
      >
        <AppText variant='headline'>♪</AppText>

        {size === 'xl' && title ? (
          <AppText
            variant='caption'
            color={Colors.dark.textSecondary}
            align='center'
            numberOfLines={2}
            style={styles.title}
          >
            {title}
          </AppText>
        ) : null}
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      resizeMode='cover'
      style={{
        width: dimension,
        height: dimension,
        borderRadius: Theme.radius.md,
      }}
    />
  );
}

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: Colors.dark.surfaceVariant,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  title: {
    marginTop: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.sm,
  },
});
