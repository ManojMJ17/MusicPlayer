import { Song } from './music';

export type RepeatMode = 'off' | 'all' | 'one';

export interface PlaybackQueue {
  songs: Song[];
  currentIndex: number;
}

export interface PlaybackProgress {
  position: number;
  duration: number;

  pendingSeek?: number | null;
}

export interface PlayerState {
  currentSong: Song | null;

  queue: PlaybackQueue;

  progress: PlaybackProgress;

  isPlaying: boolean;

  isBuffering: boolean;

  shuffleEnabled: boolean;

  repeatMode: RepeatMode;
}

export interface PlayerContextValue extends PlayerState {
  play: (song: Song, queue?: Song[]) => Promise<void>;

  pause: () => Promise<void>;

  resume: () => Promise<void>;

  stop: () => Promise<void>;

  next: () => Promise<void>;

  previous: () => Promise<void>;

  seekTo: (position: number) => Promise<void>;

  toggleShuffle: () => void;

  cycleRepeatMode: () => void;

  setQueue: (songs: Song[], startIndex?: number) => void;
}

export const INITIAL_PLAYER_STATE: PlayerState = {
  currentSong: null,

  queue: {
    songs: [],
    currentIndex: -1,
  },

  progress: {
    position: 0,
    duration: 0,
    pendingSeek: null
  },

  isPlaying: false,

  isBuffering: false,

  shuffleEnabled: false,

  repeatMode: 'off',
};
