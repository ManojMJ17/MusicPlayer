import { NativeModule, requireNativeModule } from 'expo';

declare class MusicMetadataModule extends NativeModule {
  getMetadata(assetId: string): Promise<{
    title: string | null;
    artist: string | null;
    album: string | null;
    albumArtist: string | null;
    genre: string | null;
    year: string | null;
    trackNumber: number | null;
    duration: number | null;
  }>;

  getArtwork(assetId: string): Promise<string | null>;
}

export default requireNativeModule<MusicMetadataModule>('MusicMetadata');
