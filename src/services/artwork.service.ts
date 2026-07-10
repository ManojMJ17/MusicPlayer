import MusicMetadataModule from '../../modules/music-metadata/src/MusicMetadataModule';

class ArtworkService {
  async getArtwork(id: string): Promise<string | null> {
    try {
      const artwork = await MusicMetadataModule.getArtwork(id);

      if (!artwork) {
        return null;
      }

      if (
        artwork.startsWith('/9j/') || // JPEG
        artwork.startsWith('iVBOR') // PNG
      ) {
        return `data:image/jpeg;base64,${artwork}`;
      }

      return null;
    } catch {
      return null;
    }
  }
}

export const artworkService = new ArtworkService();
