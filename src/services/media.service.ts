import {
  getAssetsAsync,
  MediaType,
  requestPermissionsAsync,
  SortBy,
} from 'expo-media-library/legacy';

import { Song } from '@/types/music';

/**
 * Strips the file extension from a filename.
 * e.g. "Cars Outside.mp3" → "Cars Outside"
 */
function stripExtension(filename: string): string {
  return filename.replace(/\.[^.]+$/, '');
}

/**
 * Parses "Artist - Title" convention or falls back to just the filename stem.
 */
function parseFilename(filename: string): { title: string; artist: string } {
  const stem = stripExtension(filename);
  const dashIndex = stem.indexOf(' - ');

  if (dashIndex !== -1) {
    return {
      artist: stem.slice(0, dashIndex).trim(),
      title: stem.slice(dashIndex + 3).trim(),
    };
  }

  return { title: stem, artist: 'Unknown Artist' };
}

/** Page size for getAssetsAsync pagination. */
const PAGE_SIZE = 500;

class MediaService {
  /**
   * Requests media-library read permission.
   * Returns true if granted, false otherwise.
   */
  async requestPermission(): Promise<boolean> {
    const { granted } = await requestPermissionsAsync();
    return granted;
  }

  /**
   * Scans all audio files on the device and returns them as Song[].
   * Uses the legacy getAssetsAsync API which works in Expo Go.
   */
  async getSongs(): Promise<Song[]> {
    const granted = await this.requestPermission();

    if (!granted) {
      throw new Error(
        'Permission to access media library was denied. Please grant permission in Settings.',
      );
    }

    const songs: Song[] = [];
    let hasNextPage = true;
    let after: string | undefined;

    // Paginate through all audio assets.
    while (hasNextPage) {
      const result = await getAssetsAsync({
        mediaType: MediaType.audio,
        first: PAGE_SIZE,
        after,
        sortBy: [[SortBy.creationTime, false]], // newest first
      });

      for (const asset of result.assets) {
        const { title, artist } = parseFilename(asset.filename ?? '');

        // asset.duration is in seconds; Song.duration is in milliseconds.
        const durationMs = asset.duration > 0 ? Math.round(asset.duration * 1000) : 0;

        // asset.creationTime is a UNIX timestamp in milliseconds.
        const addedAt =
          asset.creationTime > 0
            ? new Date(asset.creationTime).toISOString()
            : undefined;

        songs.push({
          id: asset.id,
          title,
          artist,
          album: 'Unknown Album',
          uri: asset.uri, // file:// URI on Android, ph:// on iOS
          artwork: null,
          duration: durationMs,
          addedAt,
        });
      }

      hasNextPage = result.hasNextPage;
      after = result.endCursor;
    }

    return songs;
  }
}

export const mediaService = new MediaService();
