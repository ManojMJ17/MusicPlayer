package expo.modules.musicmetadata

import android.media.MediaMetadataRetriever
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import android.net.Uri
import android.content.ContentUris
import android.provider.MediaStore
import android.util.Base64

class MusicMetadataModule : Module() {

  override fun definition() = ModuleDefinition {

    Name("MusicMetadata")

    AsyncFunction("getMetadata") { assetId: String ->

      val retriever = MediaMetadataRetriever()

      val context = appContext.reactContext
          ?: throw Exception("React context is not available")

      val contentUri = ContentUris.withAppendedId(
          MediaStore.Audio.Media.EXTERNAL_CONTENT_URI,
          assetId.toLong()
      )

      retriever.setDataSource(
          context,
          contentUri
      )


      try {
          return@AsyncFunction mapOf(
              "title" to retriever.extractMetadata(MediaMetadataRetriever.METADATA_KEY_TITLE),
              "artist" to retriever.extractMetadata(MediaMetadataRetriever.METADATA_KEY_ARTIST),
              "album" to retriever.extractMetadata(MediaMetadataRetriever.METADATA_KEY_ALBUM),
              "albumArtist" to retriever.extractMetadata(MediaMetadataRetriever.METADATA_KEY_ALBUMARTIST),
              "genre" to retriever.extractMetadata(MediaMetadataRetriever.METADATA_KEY_GENRE),
              "year" to retriever.extractMetadata(MediaMetadataRetriever.METADATA_KEY_YEAR),
              "trackNumber" to retriever.extractMetadata(
                  MediaMetadataRetriever.METADATA_KEY_CD_TRACK_NUMBER
              )?.toIntOrNull(),
              "duration" to retriever.extractMetadata(
                  MediaMetadataRetriever.METADATA_KEY_DURATION
              )?.toLongOrNull()
          )
      } finally {
          retriever.release()
      }
    }

    AsyncFunction("getArtwork") { assetId: String ->

        val retriever = MediaMetadataRetriever()

        val context = appContext.reactContext
            ?: throw Exception("React context is not available")

        val contentUri = ContentUris.withAppendedId(
            MediaStore.Audio.Media.EXTERNAL_CONTENT_URI,
            assetId.toLong()
        )

        try {
            retriever.setDataSource(context, contentUri)

            val artwork = retriever.embeddedPicture

            return@AsyncFunction artwork?.let {
                Base64.encodeToString(it, Base64.NO_WRAP)
            }
        } finally {
            retriever.release()
        }
    }
  }
}