import { mediaService } from '@/services/media.service';
import { Album, Artist, Playlist, Song } from '@/types/music';
import { libraryCacheService } from './libraryCache.service';
import { libraryMetadataService } from './libraryMetadataService';
import { customPlaylistService } from './playlist.service';

class LibraryService {
  private memorySongs: Song[] | null = null;

  setMemorySongs(songs: Song[]) {
    this.memorySongs = songs;
  }

  async getSongs(forceRefresh = false): Promise<Song[]> {
    if (!forceRefresh && this.memorySongs) {
      return this.memorySongs;
    }

    if (!forceRefresh) {
      const cachedSongs = await libraryCacheService.get();

      if (cachedSongs) {
        const songs = await Promise.all(
          cachedSongs.map(async (song) => {
            const metadata = await libraryMetadataService.get(song.id);

            return {
              ...song,
              playCount: metadata.playCount,
              lastPlayedAt: metadata.lastPlayedAt,
              isFavorite: metadata.isFavorite,
            };
          }),
        );
        this.memorySongs = songs;
        return songs;
      }
    }

    const songs = await mediaService.getSongs();

    const cacheSongs = songs.map(({ artwork, ...song }) => ({
      ...song,
      artwork: null,
    }));

    await libraryCacheService.set(cacheSongs);

    const mergedSongs = await Promise.all(
      songs.map(async (song) => {
        const metadata = await libraryMetadataService.get(song.id);

        return {
          ...song,
          playCount: metadata.playCount,
          lastPlayedAt: metadata.lastPlayedAt,
          isFavorite: metadata.isFavorite,
        };
      }),
    );
    this.memorySongs = mergedSongs;
    return mergedSongs;
  }

  buildAlbums(songs: Song[]): Album[] {
    const albumMap = new Map<string, Album>();

    for (const song of songs) {
      const key = song.album.trim().toLowerCase();

      if (!albumMap.has(key)) {
        albumMap.set(key, {
          id: key,
          title: song.album,
          artist: song.albumArtist ?? song.artist,
          year: song.year,
          songCount: 0,
          coverSongId: song.id,
        });
      }

      albumMap.get(key)!.songCount++;
    }

    return [...albumMap.values()].sort((a, b) =>
      a.title.localeCompare(b.title),
    );
  }

  async getAlbum(id: string): Promise<Album | null> {
    const albums = this.buildAlbums(await this.getSongs());

    return albums.find((album) => album.id === id) ?? null;
  }

  async getAlbumSongs(id: string): Promise<Song[]> {
    const songs = await this.getSongs();

    return songs
      .filter(
        (song) => song.album.trim().toLowerCase() === id.trim().toLowerCase(),
      )
      .sort((a, b) => {
        if (a.trackNumber != null && b.trackNumber != null) {
          return a.trackNumber - b.trackNumber;
        }

        return a.title.localeCompare(b.title);
      });
  }

  buildArtists(songs: Song[]): Artist[] {
    const artistMap = new Map<string, Artist>();

    for (const song of songs) {
      const key = song.artist.trim().toLowerCase();

      if (!artistMap.has(key)) {
        artistMap.set(key, {
          id: key,
          name: song.artist,
          artwork: song.artwork,
          albumCount: 0,
          songCount: 0,
        });
      }

      artistMap.get(key)!.songCount++;
    }

    for (const artist of artistMap.values()) {
      artist.albumCount = new Set(
        songs
          .filter((song) => song.artist.trim().toLowerCase() === artist.id)
          .map((song) => song.album),
      ).size;
    }

    return [...artistMap.values()].sort((a, b) => a.name.localeCompare(b.name));
  }

  async getArtist(id: string): Promise<Artist | null> {
    const artists = this.buildArtists(await this.getSongs());

    return artists.find((artist) => artist.id === id) ?? null;
  }

  async getArtistSongs(id: string): Promise<Song[]> {
    const songs = await this.getSongs();

    return songs
      .filter(
        (song) => song.artist.trim().toLowerCase() === id.trim().toLowerCase(),
      )
      .sort((a, b) => a.title.localeCompare(b.title));
  }

  buildPlaylists(songs: Song[]): Playlist[] {
    return [
      {
        id: 'recently-added',
        name: 'Recently Added',
        artwork: null,
        songIds: [...songs]
          .sort(
            (a, b) =>
              new Date(b.addedAt ?? 0).getTime() -
              new Date(a.addedAt ?? 0).getTime(),
          )
          .map((song) => song.id),
        createdAt: '',
        updatedAt: '',
      },

      {
        id: 'recently-played',
        name: 'Recently Played',
        artwork: null,
        songIds: [...songs]
          .filter((song) => song.lastPlayedAt)
          .sort(
            (a, b) =>
              new Date(b.lastPlayedAt!).getTime() -
              new Date(a.lastPlayedAt!).getTime(),
          )
          .map((song) => song.id),
        createdAt: '',
        updatedAt: '',
      },

      {
        id: 'most-played',
        name: 'Most Played',
        artwork: null,
        songIds: [...songs]
          .filter((song) => (song.playCount ?? 0) > 0)
          .sort((a, b) => (b.playCount ?? 0) - (a.playCount ?? 0))
          .map((song) => song.id),
        createdAt: '',
        updatedAt: '',
      },
    ];
  }

  async getPlaylist(id: string): Promise<Playlist | null> {
    const smartPlaylists = this.buildPlaylists(await this.getSongs());
    const matched = smartPlaylists.find((p) => p.id === id);
    if (matched) return matched;

    const customPlaylists = await customPlaylistService.getAll();
    return customPlaylists.find((p) => p.id === id) ?? null;
  }

  async getPlaylistSongs(id: string): Promise<Song[]> {
    const playlist = await this.getPlaylist(id);

    if (!playlist) {
      return [];
    }

    const songs = await this.getSongs();

    const songMap = new Map(songs.map((song) => [song.id, song]));

    return playlist.songIds
      .map((id) => songMap.get(id))
      .filter((song): song is Song => song !== undefined);
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
