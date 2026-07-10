import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppText } from '@/components/ui/AppText';
import { Theme } from '@/constants/theme';
import { useTheme } from '@/theme/useTheme';
import { Song } from '@/types/music';

interface SongDetailsModalProps {
  visible: boolean;
  song: Song | null;
  onClose: () => void;
}

export function SongDetailsModal({
  visible,
  song,
  onClose,
}: SongDetailsModalProps) {
  const { colors } = useTheme();

  if (!song) return null;

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 1000 / 60);
    const seconds = Math.floor((ms / 1000) % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const formatSize = (bytes?: number) => {
    if (!bytes || bytes === 0) return 'Unknown';
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const detailRows = [
    { label: 'Title', value: song.title },
    { label: 'Artist', value: song.artist },
    { label: 'Album', value: song.album },
    { label: 'Album Artist', value: song.albumArtist ?? 'Unknown' },
    { label: 'Genre', value: song.genre ?? 'Unknown' },
    { label: 'Year', value: song.year?.toString() ?? 'Unknown' },
    { label: 'Duration', value: formatDuration(song.duration) },
    { label: 'Track Number', value: song.trackNumber?.toString() ?? 'Unknown' },
    { label: 'File Size', value: formatSize(song.fileSize) },
    { label: 'Added Date', value: formatDate(song.addedAt) },
    { label: 'File Path', value: typeof song.uri === 'string' ? song.uri : 'Mock Resource' },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          onPress={() => {}}
          style={[
            styles.dialog,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <AppText variant='title' style={styles.title}>
            Song Info
          </AppText>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
          >
            {detailRows.map((row, index) => (
              <View
                key={index}
                style={[
                  styles.row,
                  { borderBottomColor: colors.border },
                  index === detailRows.length - 1 && styles.noBorder,
                ]}
              >
                <AppText
                  variant='caption'
                  color={colors.textSecondary}
                  style={styles.label}
                >
                  {row.label.toUpperCase()}
                </AppText>
                <AppText
                  variant='body'
                  style={[styles.value, { color: colors.text }]}
                  selectable
                >
                  {row.value}
                </AppText>
              </View>
            ))}
          </ScrollView>

          <View style={styles.buttonWrapper}>
            <AppButton title='Close' onPress={onClose} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.xl,
  },

  dialog: {
    width: '100%',
    maxHeight: '75%',
    borderRadius: Theme.radius.xl,
    borderWidth: 1,
    padding: Theme.spacing.xl,
    elevation: Theme.elevation.lg,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: Theme.spacing.lg,
  },

  scrollArea: {
    marginBottom: Theme.spacing.lg,
  },

  scrollContent: {
    gap: Theme.spacing.md,
  },

  row: {
    paddingBottom: Theme.spacing.sm,
    borderBottomWidth: 0.5,
  },

  noBorder: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },

  label: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 4,
  },

  value: {
    fontSize: 15,
    fontWeight: '500',
  },

  buttonWrapper: {
    width: '100%',
  },
});
