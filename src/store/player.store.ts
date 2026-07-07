import { create } from 'zustand';

import { playerService } from '@/services/player.service';
import { Song } from '@/types/music';
import { INITIAL_PLAYER_STATE, PlayerState, RepeatMode } from '@/types/player';

interface PlayerStore extends PlayerState {
  play: (song: Song, queue?: Song[]) => Promise<void>;

  pause: () => Promise<void>;

  resume: () => Promise<void>;

  stop: () => Promise<void>;

  next: () => Promise<void>;

  previous: () => Promise<void>;

  seekTo: (position: number) => Promise<void>;

  updateProgress: (position: number, duration: number) => void;

  toggleShuffle: () => void;

  cycleRepeatMode: () => void;

  setQueue: (songs: Song[], startIndex?: number) => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  ...INITIAL_PLAYER_STATE,

  async play(song, queue) {
    set(playerService.play(get(), song, queue));
  },

  async pause() {
    set(playerService.pause(get()));
  },

  async resume() {
    set(playerService.resume(get()));
  },

  async stop() {
    set(playerService.stop(get()));
  },

  async next() {
    set(playerService.next(get()));
  },

  async previous() {
    set(playerService.previous(get()));
  },

  async seekTo(position) {
    set(playerService.seekTo(get(), position));
  },

  updateProgress(position, duration) {
    set(playerService.updateProgress(get(), position, duration));
  },

  toggleShuffle() {
    set(playerService.toggleShuffle(get()));
  },

  cycleRepeatMode() {
    const current = get().repeatMode;

    const nextMode: RepeatMode =
      current === 'off' ? 'all' : current === 'all' ? 'one' : 'off';

    set(playerService.setRepeatMode(get(), nextMode));
  },

  setQueue(songs, startIndex = 0) {
    set(playerService.setQueue(get(), songs, startIndex));
  },
}));
