import { usePlayerStore } from '@/store/player.store';

export function usePlayer() {
  const currentSong = usePlayerStore((state) => state.currentSong);

  const queue = usePlayerStore((state) => state.queue);

  const progress = usePlayerStore((state) => state.progress);

  const isPlaying = usePlayerStore((state) => state.isPlaying);

  const isBuffering = usePlayerStore((state) => state.isBuffering);

  const shuffleEnabled = usePlayerStore((state) => state.shuffleEnabled);

  const repeatMode = usePlayerStore((state) => state.repeatMode);

  const play = usePlayerStore((state) => state.play);

  const pause = usePlayerStore((state) => state.pause);

  const resume = usePlayerStore((state) => state.resume);

  const stop = usePlayerStore((state) => state.stop);

  const next = usePlayerStore((state) => state.next);

  const previous = usePlayerStore((state) => state.previous);

  const seekTo = usePlayerStore((state) => state.seekTo);

  const toggleShuffle = usePlayerStore((state) => state.toggleShuffle);

  const cycleRepeatMode = usePlayerStore((state) => state.cycleRepeatMode);

  const setQueue = usePlayerStore((state) => state.setQueue);

  return {
    currentSong,

    queue,

    progress,

    isPlaying,

    isBuffering,

    shuffleEnabled,

    repeatMode,

    play,

    pause,

    resume,

    stop,

    next,

    previous,

    seekTo,

    toggleShuffle,

    cycleRepeatMode,

    setQueue,
  };
}
