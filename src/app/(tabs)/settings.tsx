import { router } from 'expo-router';
import { Alert, StyleSheet, View } from 'react-native';
import { Flame, Music, Palette, Info } from 'lucide-react-native';

import { PageLayout } from '@/components/common/PageLayout';
import { SettingsItem } from '@/components/settings/SettingsItem';
import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';
import { Theme } from '@/constants/theme';
import { useLibraryStore } from '@/store/library.store';
import { ThemePicker } from '@/theme/ThemePicker';
import { useTheme } from '@/theme/useTheme';
import { useState } from 'react';

export default function SettingsScreen() {
  const [themePickerVisible, setThemePickerVisible] = useState(false);

  const refreshLibrary = useLibraryStore((state) => state.refreshLibrary);
  const songs = useLibraryStore((state) => state.songs);

  const theme = useTheme();

  // Calculate statistics
  const totalMinutes = songs.reduce(
    (acc, song) => acc + (song.playCount ?? 0) * (song.duration / 1000 / 60),
    0
  );
  const totalHours = Math.round(totalMinutes / 60);
  const displayHours =
    totalHours > 0
      ? `${totalHours} hrs`
      : `${Math.round(totalMinutes)} mins`;

  const totalPlays = songs.reduce((acc, song) => acc + (song.playCount ?? 0), 0);
  const totalSongs = songs.length;
  const favoriteCount = songs.filter((s) => s.isFavorite).length;

  const sortedByPlays = [...songs].sort(
    (a, b) => (b.playCount ?? 0) - (a.playCount ?? 0)
  );
  const mostPlayedSong =
    sortedByPlays[0] && (sortedByPlays[0].playCount ?? 0) > 0
      ? sortedByPlays[0]
      : null;

  return (
    <PageLayout title='Settings' subtitle='Application preferences'>
      <View style={styles.container}>
        {/* Listening Stats Card */}
        <AppCard style={styles.statsCard} contentStyle={styles.statsContent}>
          <AppText variant='title' style={styles.statsTitle}>
            Your Listening
          </AppText>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <AppText variant='caption' color={theme.colors.textSecondary}>
                ⏱ TIME
              </AppText>
              <AppText variant='body' style={styles.statValue}>
                {displayHours}
              </AppText>
            </View>

            <View style={styles.statBox}>
              <AppText variant='caption' color={theme.colors.textSecondary}>
                🎵 PLAYS
              </AppText>
              <AppText variant='body' style={styles.statValue}>
                {totalPlays.toLocaleString()} {totalPlays === 1 ? 'Play' : 'Plays'}
              </AppText>
            </View>
          </View>

          <View style={[styles.statsGrid, { marginTop: Theme.spacing.md }]}>
            <View style={styles.statBox}>
              <AppText variant='caption' color={theme.colors.textSecondary}>
                💿 SONGS
              </AppText>
              <AppText variant='body' style={styles.statValue}>
                {totalSongs} {totalSongs === 1 ? 'Song' : 'Songs'}
              </AppText>
            </View>

            <View style={styles.statBox}>
              <AppText variant='caption' color={theme.colors.textSecondary}>
                ❤️ FAVORITES
              </AppText>
              <AppText variant='body' style={styles.statValue}>
                {favoriteCount}
              </AppText>
            </View>
          </View>

          {mostPlayedSong && (
            <View style={styles.mostPlayedContainer}>
              <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

              <View style={styles.mostPlayedHeader}>
                <Flame
                  size={16}
                  color={theme.colors.primary}
                  fill={theme.colors.primary}
                  style={{ marginRight: 6 }}
                />
                <AppText
                  variant='caption'
                  color={theme.colors.textSecondary}
                  style={{ fontWeight: '600' }}
                >
                  MOST PLAYED
                </AppText>
              </View>

              <AppText variant='body' style={styles.songTitle} numberOfLines={1}>
                {mostPlayedSong.title}
              </AppText>
              <AppText
                variant='bodySmall'
                color={theme.colors.textSecondary}
                numberOfLines={1}
              >
                {mostPlayedSong.artist}
              </AppText>
            </View>
          )}
        </AppCard>

        <SettingsItem
          title='Scan Library'
          subtitle='Find newly added music'
          icon={Music}
          onPress={async () => {
            await refreshLibrary();
            Alert.alert(
              'Library Updated',
              'Your music library has been refreshed.',
            );
          }}
        />

        <SettingsItem
          title='Theme'
          subtitle={theme.displayName}
          icon={Palette}
          onPress={() => setThemePickerVisible(true)}
        />

        <SettingsItem
          title='About'
          subtitle='Version 1.0.0'
          icon={Info}
          onPress={() => router.push('/about')}
        />
      </View>

      <ThemePicker
        visible={themePickerVisible}
        onClose={() => setThemePickerVisible(false)}
      />
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Theme.spacing.md,
  },

  statsCard: {
    marginBottom: Theme.spacing.sm,
  },

  statsContent: {
    padding: Theme.spacing.lg,
  },

  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Theme.spacing.md,
  },

  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  statBox: {
    flex: 1,
  },

  statValue: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },

  mostPlayedContainer: {
    marginTop: Theme.spacing.md,
  },

  divider: {
    height: 1,
    width: '100%',
    marginVertical: Theme.spacing.md,
  },

  mostPlayedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  songTitle: {
    fontWeight: '700',
    fontSize: 15,
  },
});
