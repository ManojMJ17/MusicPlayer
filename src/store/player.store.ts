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

  addToQueueNext: (song: Song) => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  ...INITIAL_PLAYER_STATE,

  play: async (song, queue) => {

    set((state) => playerService.play(state, song, queue));
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

  addToQueueNext(song) {
    const state = get();
    const { songs, currentIndex } = state.queue;

    // If queue is empty or no song is loaded, play it immediately as a new queue
    if (songs.length === 0 || currentIndex === -1 || !state.currentSong) {
      set(playerService.setQueue(state, [song], 0));
      return;
    }

    // If the song is already the next item in the queue, do nothing
    const nextIndex = currentIndex + 1;
    if (songs[nextIndex] && songs[nextIndex].id === song.id) {
      return;
    }

    // Filter out duplicate instances of this song elsewhere in the queue
    // (excluding the current song itself, just in case)
    const filteredSongs = songs.filter((s, idx) => s.id !== song.id || idx === currentIndex);
    const newCurrentIndex = filteredSongs.findIndex((s) => s.id === state.currentSong?.id);

    const updatedSongs = [...filteredSongs];
    updatedSongs.splice(newCurrentIndex + 1, 0, song);

    set({
      queue: {
        songs: updatedSongs,
        currentIndex: newCurrentIndex,
      },
    });
  },
}));
