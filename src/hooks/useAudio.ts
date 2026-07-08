import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useEffect, useRef } from 'react';

import { libraryMetadataService } from '@/services/libraryMetadataService';
import { usePlayerStore } from '@/store/player.store';

/**
 * Audio engine bridge between the Zustand player store and expo-audio.
 *
 * Mount this once at the root layout. It subscribes to the store's
 * currentSong and isPlaying state and drives the native audio player
 * accordingly — so every consumer (MiniPlayer, FullPlayer, SongsScreen)
 * only needs to call the store actions and audio follows automatically.
 */
export function useAudio() {
  const player = useAudioPlayer(null);

  const status = useAudioPlayerStatus(player);

  const updateProgress = usePlayerStore((state) => state.updateProgress);
  const pendingSeek = usePlayerStore((state) => state.progress.pendingSeek);

  const currentSong = usePlayerStore((state) => state.currentSong);
  const isPlaying = usePlayerStore((state) => state.isPlaying);

  const next = usePlayerStore((state) => state.next);
  const repeatMode = usePlayerStore((state) => state.repeatMode);

  // Track the last song we loaded so we only call replace() on a real change.
  const loadedSongId = useRef<string | null>(null);

  // --- Load a new song when currentSong changes ---
  useEffect(() => {
    if (!currentSong) {
      player.pause();
      loadedSongId.current = null;
      return;
    }

    if (currentSong.id === loadedSongId.current) {
      // Same song already loaded — isPlaying effect handles play/pause.
      return;
    }

    const rawUri = currentSong.uri;

    // Accept any string URI (file:// on Android, ph:// on iOS).
    // Reject only non-string values (e.g. a require() number with no backing file).
    if (typeof rawUri !== 'string' || rawUri.length === 0) {
      loadedSongId.current = currentSong.id;
      return;
    }

    loadedSongId.current = currentSong.id;

    libraryMetadataService.incrementPlay(currentSong.id);

    player.replace({ uri: rawUri });
    // The isPlaying effect below will call player.play() after replace.
  }, [currentSong?.id]);

  // --- Sync isPlaying → native player ---
  useEffect(() => {
    if (!currentSong) return;

    if (isPlaying) {
      player.play();
    } else {
      player.pause();
    }
  }, [isPlaying, currentSong?.id]);

  // --- Send playback progress to the store ---
  useEffect(() => {
    updateProgress(
      status.currentTime ?? 0,
      status.duration ?? 0
    );
  }, [
    status.currentTime,
    status.duration,
  ]);

  // --- Apply pending seeks when the user drags the slider ---
  useEffect(() => {
    if (pendingSeek == null) return;

    player.seekTo(pendingSeek);

    usePlayerStore.setState((state) => ({
      progress: {
        ...state.progress,
        pendingSeek: null,
      },
    }));
  }, [pendingSeek]);



  // --- Handle song end → next track (respect shuffle + repeat) ---
  useEffect(() => {
    if (!status.didJustFinish) return;

    if (repeatMode === 'one') {
      player.seekTo(0);
      player.play();
      return;
    }

    next();
  }, [status.didJustFinish]);
}
