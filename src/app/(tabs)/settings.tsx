import { router } from 'expo-router';
import { Alert, StyleSheet, View } from 'react-native';

import { PageLayout } from '@/components/common/PageLayout';
import { SettingsItem } from '@/components/settings/SettingsItem';
import { Theme } from '@/constants/theme';
import { useLibraryStore } from '@/store/library.store';

export default function SettingsScreen() {
  const refreshLibrary = useLibraryStore((state) => state.refreshLibrary);
  const loading = useLibraryStore((state) => state.loading);

  return (
    <PageLayout title='Settings' subtitle='Application preferences'>
      <View style={styles.container}>
        <SettingsItem
          title='Scan Library'
          subtitle='Find newly added music'
          icon='library-music'
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
          subtitle='Dark mode'
          icon='dark-mode'
          onPress={() =>
            Alert.alert(
              'Coming Soon',
              'Theme customization will be available later.',
            )
          }
        />

        <SettingsItem
          title='Sleep Timer'
          subtitle='Stop playback automatically'
          icon='bedtime'
          onPress={() =>
            Alert.alert('Coming Soon', 'Sleep Timer will be available later.')
          }
        />

        <SettingsItem
          title='About'
          subtitle='Version 1.0.0'
          icon='info-outline'
          onPress={() => router.push('/about')}
        />
      </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Theme.spacing.md,
  },
});
