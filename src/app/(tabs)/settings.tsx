import { MaterialIcons } from '@expo/vector-icons';
import { Alert, StyleSheet, View } from 'react-native';

import { PageLayout } from '@/components/common/PageLayout';
import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';
import { Colors } from '@/constants/colors';
import { Theme } from '@/constants/theme';

interface SettingsItemProps {
  title: string;
  subtitle?: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
}

function SettingsItem({ title, subtitle, icon, onPress }: SettingsItemProps) {
  return (
    <AppCard onPress={onPress} contentStyle={styles.itemContent}>
      <View style={styles.leading}>
        <MaterialIcons name={icon} size={22} color={Colors.dark.primary} />
      </View>

      <View style={styles.textContainer}>
        <AppText variant='body'>{title}</AppText>

        {subtitle ? (
          <AppText
            variant='caption'
            color={Colors.dark.textSecondary}
            style={styles.subtitle}
          >
            {subtitle}
          </AppText>
        ) : null}
      </View>

      <MaterialIcons
        name='chevron-right'
        size={22}
        color={Colors.dark.textSecondary}
      />
    </AppCard>
  );
}

export default function SettingsScreen() {
  return (
    <PageLayout title='Settings' subtitle='Application preferences'>
      <View style={styles.container}>
        <SettingsItem
          title='Scan Music Library'
          subtitle='Find music stored on your device'
          icon='library-music'
          onPress={() =>
            Alert.alert(
              'Coming Soon',
              'Media scanning will be implemented in Phase 2.',
            )
          }
        />

        <SettingsItem
          title='Theme'
          subtitle='Dark mode (default)'
          icon='dark-mode'
          onPress={() =>
            Alert.alert(
              'Coming Soon',
              'Theme customization will be added later.',
            )
          }
        />

        <SettingsItem
          title='Sleep Timer'
          subtitle='Stop playback automatically'
          icon='bedtime'
          onPress={() =>
            Alert.alert(
              'Coming Soon',
              'Sleep Timer will be implemented in Phase 5.',
            )
          }
        />

        <SettingsItem
          title='About'
          subtitle='Version 1.0.0'
          icon='info-outline'
          onPress={() =>
            Alert.alert(
              'Offline Music Player',
              'Built with React Native + Expo.',
            )
          }
        />
      </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Theme.spacing.md,
  },

  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.md,
  },

  leading: {
    width: 44,
    height: 44,
    borderRadius: Theme.radius.md,
    backgroundColor: Colors.dark.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },

  textContainer: {
    flex: 1,
  },

  subtitle: {
    marginTop: Theme.spacing.xs,
  },
});
