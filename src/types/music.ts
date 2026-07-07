export interface Song {
  /** Unique identifier (mock ID now, MediaStore ID later) */
  id: string;

  /** Song title */
  title: string;

  /** Artist name */
  artist: string;

  /** Album name */
  album: string;

  /** Absolute file URI (empty in mock data if unavailable) */
  uri: string;

  /** Album artwork URI */
  artwork?: string | null;

  /** Duration in milliseconds */
  duration: number;

  /** Track number within the album */
  trackNumber?: number;

  /** Disc number (for multi-disc albums) */
  discNumber?: number;

  /** File size in bytes */
  fileSize?: number;

  /** Release year */
  year?: number;

  /** Genre */
  genre?: string;

  /** Whether the song is marked as a favorite */
  isFavorite: boolean;

  /** Number of times the song has been played */
  playCount: number;

  /** Last played timestamp (ISO string) */
  lastPlayedAt?: string | null;

  /** Date the song was added to the library */
  addedAt: string;
}

export interface Album {
  id: string;

  title: string;

  artist: string;

  artwork?: string | null;

  year?: number;

  songCount: number;
}

export interface Artist {
  id: string;

  name: string;

  artwork?: string | null;

  albumCount: number;

  songCount: number;
}

export interface Playlist {
  id: string;

  name: string;

  artwork?: string | null;

  songIds: string[];

  createdAt: string;

  updatedAt: string;
}

export interface QueueItem {
  songId: string;

  order: number;
}

export type RepeatMode = 'off' | 'all' | 'one';

export interface PlaybackState {
  currentSongId: string | null;

  queue: QueueItem[];

  currentIndex: number;

  isPlaying: boolean;

  shuffle: boolean;

  repeatMode: RepeatMode;

  position: number;

  duration: number;
}
