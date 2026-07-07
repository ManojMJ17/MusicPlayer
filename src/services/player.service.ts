import { Song } from '@/types/music';
import { PlayerState, RepeatMode } from '@/types/player';

class PlayerService {
  play(state: PlayerState, song: Song, queue: Song[] = [song]): PlayerState {
    const currentIndex = queue.findIndex((item) => item.id === song.id);

    return {
      ...state,
      currentSong: song,
      queue: {
        songs: queue,
        currentIndex,
      },
      progress: {
        position: 0,
        duration: song.duration,
      },
      isPlaying: true,
      isBuffering: false,
    };
  }

  pause(state: PlayerState): PlayerState {
    return {
      ...state,
      isPlaying: false,
    };
  }

  resume(state: PlayerState): PlayerState {
    if (!state.currentSong) {
      return state;
    }

    return {
      ...state,
      isPlaying: true,
    };
  }

  stop(state: PlayerState): PlayerState {
    return {
      ...state,
      currentSong: null,
      queue: {
        songs: [],
        currentIndex: -1,
      },
      progress: {
        position: 0,
        duration: 0,
      },
      isPlaying: false,
      isBuffering: false,
    };
  }

  seekTo(state: PlayerState, position: number): PlayerState {
    return {
      ...state,
      progress: {
        ...state.progress,
        position,
        pendingSeek: position,
      },
    };
  }

  updateProgress(
    state: PlayerState,
    position: number,
    duration: number
  ): PlayerState {
    return {
      ...state,
      progress: {
        position,
        duration,
      },
    };
  }

  setQueue(state: PlayerState, songs: Song[], startIndex = 0): PlayerState {
    const currentSong = songs.length > 0 ? (songs[startIndex] ?? null) : null;

    return {
      ...state,
      currentSong,
      queue: {
        songs,
        currentIndex: currentSong ? startIndex : -1,
      },
      progress: {
        position: 0,
        duration: currentSong?.duration ?? 0,
      },
    };
  }

  next(state: PlayerState): PlayerState {
    const { songs, currentIndex } = state.queue;

    if (songs.length === 0) {
      return state;
    }

    let nextIndex;

    if (state.shuffleEnabled) {
      if (songs.length === 1) {
        nextIndex = 0;
      } else {
        do {
          nextIndex = Math.floor(Math.random() * songs.length);
        } while (nextIndex === currentIndex);
      }
    } else {
      nextIndex = currentIndex + 1;
    }

    if (nextIndex >= songs.length) {
      if (state.repeatMode === 'all') {
        nextIndex = 0;
      } else {
        return state;
      }
    }

    return this.play(state, songs[nextIndex], songs);
  }

  previous(state: PlayerState): PlayerState {
    const { songs, currentIndex } = state.queue;

    if (songs.length === 0) {
      return state;
    }

    let previousIndex = currentIndex - 1;

    if (previousIndex < 0) {
      if (state.repeatMode === 'all') {
        previousIndex = songs.length - 1;
      } else {
        previousIndex = 0;
      }
    }

    return this.play(state, songs[previousIndex], songs);
  }

  toggleShuffle(state: PlayerState): PlayerState {
    return {
      ...state,
      shuffleEnabled: !state.shuffleEnabled,
    };
  }

  setRepeatMode(state: PlayerState, repeatMode: RepeatMode): PlayerState {
    return {
      ...state,
      repeatMode,
    };
  }
}

export const playerService = new PlayerService();
