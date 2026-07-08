import { mediaService } from '@/services/media.service';
import { Album, Artist, Playlist, Song } from '@/types/music';
import { libraryMetadataService } from './libraryMetadataService';

class LibraryService {
  async getSongs(): Promise<Song[]> {
    const songs = await mediaService.getSongs();

    return Promise.all(
      songs.map(async (song) => {
        const metadata = await libraryMetadataService.get(song.id);

        return {
          ...song,
          playCount: metadata.playCount,
          lastPlayedAt: metadata.lastPlayedAt,
          isFavorite: metadata.isFavorite,
        };
      })
    );
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
          // artwork: song.artwork,
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


  async getAlbum(id: string): Promise<Album | null> {
    const albums = await this.getAlbums();

    return albums.find((album) => album.id === id) ?? null;
  }

  async getAlbumSongs(id: string): Promise<Song[]> {
    const songs = await this.getSongs();

    return songs
      .filter((song) => `${song.album}-${song.artist}` === id)
      .sort((a, b) => {
        if (a.trackNumber != null && b.trackNumber != null) {
          return a.trackNumber - b.trackNumber;
        }

        return a.title.localeCompare(b.title);
      });
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

  async getArtist(id: string): Promise<Artist | null> {
    const artists = await this.getArtists();

    return artists.find((artist) => artist.id === id) ?? null;
  }

  async getArtistSongs(id: string): Promise<Song[]> {
    const songs = await this.getSongs();

    return songs
      .filter((song) => song.artist === id)
      .sort((a, b) => a.title.localeCompare(b.title));
  }

  async getPlaylists(): Promise<Playlist[]> {
    const songs = await this.getSongs();

    return [
      {
        id: 'recently-added',
        name: 'Recently Added',
        artwork: null,
        songIds: [...songs]
          .sort(
            (a, b) =>
              new Date(b.addedAt ?? 0).getTime() -
              new Date(a.addedAt ?? 0).getTime()
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
          .filter(song => song.lastPlayedAt)
          .sort(
            (a, b) =>
              new Date(b.lastPlayedAt!).getTime() -
              new Date(a.lastPlayedAt!).getTime()
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
          .filter(song => (song.playCount ?? 0) > 0)
          .sort((a, b) => (b.playCount ?? 0) - (a.playCount ?? 0))
          .map((song) => song.id),
        createdAt: '',
        updatedAt: '',
      },
    ];
  }

  async getPlaylist(id: string): Promise<Playlist | null> {
    const playlists = await this.getPlaylists();

    return playlists.find((playlist) => playlist.id === id) ?? null;
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
