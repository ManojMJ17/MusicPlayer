import { ImageSourcePropType } from 'react-native';

const songAssets: Record<string, number> = {
  'cars_outside.mp3': require('@/assets/songs/cars_outside.mp3'),

  // Add more songs here as you create them.
};

const artworkAssets: Record<string, ImageSourcePropType> = {
  'cars_outside.jpg': require('@/assets/images/cars_outside.jpg'),

  // Add more artwork here.
};

export function resolveSongSource(uri: string): number | { uri: string } {
  if (uri.startsWith('file://')) {
    return { uri };
  }

  const asset = songAssets[uri];

  if (!asset) {
    throw new Error(`Song asset not found: ${uri}`);
  }

  return asset;
}

export function resolveArtworkSource(
  artwork?: string | null,
): ImageSourcePropType | undefined {
  if (!artwork) {
    return undefined;
  }

  if (artwork.startsWith('file://')) {
    return { uri: artwork };
  }

  return artworkAssets[artwork];
}
