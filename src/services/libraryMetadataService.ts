import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'music-library-metadata';

export interface SongMetadata {
    playCount: number;
    lastPlayedAt: string | null;
    isFavorite: boolean;
}

class LibraryMetadataService {
    private async getAll(): Promise<Record<string, SongMetadata>> {
        const json = await AsyncStorage.getItem(STORAGE_KEY);

        return json ? JSON.parse(json) : {};
    }

    private async saveAll(data: Record<string, SongMetadata>) {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    async get(songId: string): Promise<SongMetadata> {
        const data = await this.getAll();

        return (
            data[songId] ?? {
                playCount: 0,
                lastPlayedAt: null,
                isFavorite: false,
            }
        );
    }

    async incrementPlay(songId: string) {
        const data = await this.getAll();

        const metadata =
            data[songId] ?? {
                playCount: 0,
                lastPlayedAt: null,
                isFavorite: false,
            };

        metadata.playCount += 1;
        metadata.lastPlayedAt = new Date().toISOString();

        data[songId] = metadata;

        await this.saveAll(data);
    }
}

export const libraryMetadataService = new LibraryMetadataService();