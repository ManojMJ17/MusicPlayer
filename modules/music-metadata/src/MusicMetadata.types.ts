// Define your exported module types here.
export interface AudioMetadata {
  title: string | null;
  artist: string | null;
  album: string | null;
  albumArtist: string | null;
  artwork: string | null;
  year: string | null;
  genre: string | null;
  trackNumber: number | null;
  duration: number | null;
}
