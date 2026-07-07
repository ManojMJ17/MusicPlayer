import { mockSongs } from '@/data/mockSongs';
import { Album, Artist, Playlist, Song } from '@/types/music';

class LibraryService {
  async getSongs(): Promise<Song[]> {
    // Next task:
    // return await mediaService.getSongs();

    return [...mockSongs];
  }

  async getAlbums(): Promise<Album[]> {
    const songs = await this.getSongs();

    const albumMap = new Map<string, Album>();

    for (const song of songs) {
      const key = `${song.album}-${song.artist}`;

      if (!albumMap.has(key)) {
        albumMap.set(key, {
          id: key,
          title: song.album,
          artist: song.artist,
          artwork: song.artwork,
          year: song.year,
          songCount: 0,
        });
      }

      albumMap.get(key)!.songCount++;
    }

    return [...albumMap.values()].sort((a, b) =>
      a.title.localeCompare(b.title),
    );
  }

  async getArtists(): Promise<Artist[]> {
    const songs = await this.getSongs();

    const artistMap = new Map<string, Artist>();

    for (const song of songs) {
      if (!artistMap.has(song.artist)) {
        artistMap.set(song.artist, {
          id: song.artist,
          name: song.artist,
          artwork: song.artwork,
          albumCount: 0,
          songCount: 0,
        });
      }

      artistMap.get(song.artist)!.songCount++;
    }

    for (const artist of artistMap.values()) {
      artist.albumCount = new Set(
        songs
          .filter((song) => song.artist === artist.name)
          .map((song) => song.album),
      ).size;
    }

    return [...artistMap.values()].sort((a, b) => a.name.localeCompare(b.name));
  }

  async getPlaylists(): Promise<Playlist[]> {
    return [];
  }

  async searchSongs(query: string): Promise<Song[]> {
    const songs = await this.getSongs();

    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return songs;
    }

    return songs.filter((song) => {
      return (
        song.title.toLowerCase().includes(normalizedQuery) ||
        song.artist.toLowerCase().includes(normalizedQuery) ||
        song.album.toLowerCase().includes(normalizedQuery)
      );
    });
  }
}

export const libraryService = new LibraryService();
