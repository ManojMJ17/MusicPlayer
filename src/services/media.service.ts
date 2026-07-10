import {
  getAssetsAsync,
  MediaType,
  requestPermissionsAsync,
  SortBy,
} from 'expo-media-library/legacy';

import { Song } from '@/types/music';
import MusicMetadataModule from '../../modules/music-metadata/src/MusicMetadataModule';

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

      const pageSongs = await Promise.all(
        result.assets.map(async (asset) => {
          let metadata = null;

          try {
            metadata = await MusicMetadataModule.getMetadata(asset.id);
          } catch (e) {
            console.warn(`Skipping unreadable file: ${asset.filename}`);
            console.warn(e);
            return null;
          }

          const duration =
            metadata?.duration ??
            (asset.duration > 0 ? Math.round(asset.duration * 1000) : 0);
          return {
            id: asset.id,

            title:
              metadata?.title ??
              asset.filename?.replace(/\.[^.]+$/, '') ??
              'Unknown Title',

            artist: metadata?.artist ?? 'Unknown Artist',

            album: metadata?.album ?? 'Unknown Album',

            albumArtist: metadata?.albumArtist ?? undefined,

            genre: metadata?.genre ?? undefined,

            year: metadata?.year ? Number(metadata.year) : undefined,

            trackNumber: metadata?.trackNumber ?? undefined,

            uri: asset.uri,

            artwork: metadata?.artwork
              ? `data:image/jpeg;base64,${metadata.artwork}`
              : null,

            duration,

            addedAt:
              asset.creationTime > 0
                ? new Date(asset.creationTime).toISOString()
                : undefined,
          };
        }),
      );

      songs.push(...pageSongs.filter((song): song is Song => song !== null));
      hasNextPage = result.hasNextPage;
      after = result.endCursor;
    }

    return songs;
  }
}

export const mediaService = new MediaService();
