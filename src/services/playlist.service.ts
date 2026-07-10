import AsyncStorage from '@react-native-async-storage/async-storage';
import { Playlist } from '@/types/music';

const STORAGE_KEY = 'music-user-playlists';

class CustomPlaylistService {
  async getAll(): Promise<Playlist[]> {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      return json ? JSON.parse(json) : [];
    } catch (error) {
      console.error('Failed to get custom playlists:', error);
      return [];
    }
  }

  async saveAll(playlists: Playlist[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(playlists));
    } catch (error) {
      console.error('Failed to save custom playlists:', error);
    }
  }

  async create(name: string, icon?: string): Promise<Playlist> {
    const playlists = await this.getAll();
    const newPlaylist: Playlist = {
      id: `custom-${Date.now()}`,
      name,
      icon: icon || 'music',
      artwork: null,
      songIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    playlists.push(newPlaylist);
    await this.saveAll(playlists);
    return newPlaylist;
  }

  async delete(id: string): Promise<void> {
    const playlists = await this.getAll();
    const filtered = playlists.filter((p) => p.id !== id);
    await this.saveAll(filtered);
  }

  async addSong(playlistId: string, songId: string): Promise<Playlist | null> {
    const playlists = await this.getAll();
    const playlist = playlists.find((p) => p.id === playlistId);
    if (!playlist) return null;

    if (!playlist.songIds.includes(songId)) {
      playlist.songIds.push(songId);
      playlist.updatedAt = new Date().toISOString();
      await this.saveAll(playlists);
    }
    return playlist;
  }

  async removeSong(playlistId: string, songId: string): Promise<Playlist | null> {
    const playlists = await this.getAll();
    const playlist = playlists.find((p) => p.id === playlistId);
    if (!playlist) return null;

    playlist.songIds = playlist.songIds.filter((id) => id !== songId);
    playlist.updatedAt = new Date().toISOString();
    await this.saveAll(playlists);
    return playlist;
  }

  async edit(playlistId: string, newName: string, newIcon?: string): Promise<Playlist | null> {
    const playlists = await this.getAll();
    const playlist = playlists.find((p) => p.id === playlistId);
    if (!playlist) return null;

    playlist.name = newName;
    if (newIcon) {
      playlist.icon = newIcon;
    }
    playlist.updatedAt = new Date().toISOString();
    await this.saveAll(playlists);
    return playlist;
  }
}

export const customPlaylistService = new CustomPlaylistService();
