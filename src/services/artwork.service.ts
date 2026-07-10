import MusicMetadataModule from '../../modules/music-metadata/src/MusicMetadataModule';

class ArtworkService {
  private cache = new Map<string, string | null>();

  async getArtwork(id: string): Promise<string | null> {
    if (this.cache.has(id)) {
      return this.cache.get(id)!;
    }

    try {
      const artwork = await MusicMetadataModule.getArtwork(id);

      if (!artwork) {
        this.cache.set(id, null);
        return null;
      }

      let formattedArtwork: string | null = null;
      if (
        artwork.startsWith('/9j/') || // JPEG
        artwork.startsWith('iVBOR') // PNG
      ) {
        formattedArtwork = `data:image/jpeg;base64,${artwork}`;
      }

      this.cache.set(id, formattedArtwork);
      return formattedArtwork;
    } catch {
      this.cache.set(id, null);
      return null;
    }
  }
}

export const artworkService = new ArtworkService();
