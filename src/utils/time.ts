/**
 * Formats a duration in milliseconds to mm:ss or hh:mm:ss.
 *
 * Examples:
 * 65000     -> 1:05
 * 245000    -> 4:05
 * 3661000   -> 1:01:01
 */
export function formatDuration(durationMs: number): string {
  if (!Number.isFinite(durationMs) || durationMs < 0) {
    return '0:00';
  }

  const totalSeconds = Math.floor(durationMs / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Formats a playback position as mm:ss.
 *
 * Useful for the seek bar.
 */
export function formatPosition(positionMs: number): string {
  return formatDuration(positionMs);
}
