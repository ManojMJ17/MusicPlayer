import { ImageSourcePropType } from 'react-native';

/**
 * Resolves a song's artwork field to an ImageSourcePropType.
 *
 * Real device songs return null for artwork (MediaLibrary doesn't expose
 * embedded artwork), so this will typically return undefined and the
 * caller falls back to the default album image.
 *
 * If a future implementation supplies a file:// URI for artwork,
 * this will handle it correctly.
 */
export function resolveArtworkSource(
  artwork?: ImageSourcePropType | string | null,
): ImageSourcePropType | undefined {
  if (!artwork) {
    return undefined;
  }

  if (typeof artwork === 'string' && artwork.startsWith('file://')) {
    return { uri: artwork };
  }

  if (typeof artwork === 'string' || typeof artwork === 'number') {
    // number = require() result, string = remote URL — pass through as-is.
    return artwork as ImageSourcePropType;
  }

  // Already an ImageSourcePropType object.
  return artwork as ImageSourcePropType;
}
