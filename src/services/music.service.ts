import { mockSongs } from '@/data/mockSongs';
import { Album, Artist, Playlist, Song } from '@/types/music';

class MusicService {
  /**
   * Returns all songs.
   * Later this will read from the device media library.
   */
  async getSongs(): Promise<Song[]> {
    return [...mockSongs];
  }

  /**
   * Returns a single song by its ID.
   */
  async getSongById(id: string): Promise<Song | null> {
    const song = mockSongs.find((song) => song.id === id);

    return song ?? null;
  }

  /**
   * Groups songs into albums.
   */
  async getAlbums(): Promise<Album[]> {
    const albumMap = new Map<string, Album>();

    for (const song of mockSongs) {
      const key = `${song.album}-${song.artist}`;

      if (!albumMap.has(key)) {
        albumMap.set(key, {
          id: key,
          title: song.album,
          artist: song.artist,
          artwork: song.artwork ?? null,
          year: song.year,
          songCount: 0,
        });
      }

      const album = albumMap.get(key)!;
      album.songCount += 1;
    }

    return Array.from(albumMap.values()).sort((a, b) =>
      a.title.localeCompare(b.title),
    );
  }

  /**
   * Groups songs into artists.
   */
  async getArtists(): Promise<Artist[]> {
    const artistMap = new Map<string, Artist>();

    for (const song of mockSongs) {
      if (!artistMap.has(song.artist)) {
        artistMap.set(song.artist, {
          id: song.artist,
          name: song.artist,
          artwork: song.artwork ?? null,
          albumCount: 0,
          songCount: 0,
        });
      }

      const artist = artistMap.get(song.artist)!;

      artist.songCount += 1;
    }

    // Calculate album count for each artist.
    for (const artist of artistMap.values()) {
      const albums = new Set(
        mockSongs
          .filter((song) => song.artist === artist.name)
          .map((song) => song.album),
      );

      artist.albumCount = albums.size;
    }

    return Array.from(artistMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }

  /**
   * Placeholder until playlist storage is implemented.
   */
  async getPlaylists(): Promise<Playlist[]> {
    return [];
  }

  /**
   * Performs a simple local search.
   */
  async searchSongs(query: string): Promise<Song[]> {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return this.getSongs();
    }

    return mockSongs.filter((song) => {
      return (
        song.title.toLowerCase().includes(normalizedQuery) ||
        song.artist.toLowerCase().includes(normalizedQuery) ||
        song.album.toLowerCase().includes(normalizedQuery)
      );
    });
  }
}

export const musicService = new MusicService();
