import { PageLayout } from '@/components/common/PageLayout';
import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';
import { Colors } from '@/constants/colors';
import { Theme } from '@/constants/theme';
import Constants from 'expo-constants';
import { Image } from 'expo-image';
import { Linking, StyleSheet, View } from 'react-native';
function AboutRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <AppText variant='body'>{label}</AppText>

      <AppText variant='body' color={Colors.dark.textSecondary}>
        {value}
      </AppText>
    </View>
  );
}

export default function AboutScreen() {
  return (
    <PageLayout title='Music' subtitle='Offline Music Player' scrollable>
      <View style={styles.container}>
        <View style={styles.hero}>
          <Image
            source={require('@/assets/images/logo.png')}
            style={styles.logo}
            contentFit='contain'
          />

          <AppText variant='headline' style={styles.title}>
            Music
          </AppText>

          <AppText variant='body' color={Colors.dark.textSecondary}>
            Offline Music Player
          </AppText>

          <AppText variant='caption' color={Colors.dark.textSecondary}>
            Version {Constants.expoConfig?.version}
          </AppText>
        </View>

        <AppCard onPress={() => {}}>
          <View style={styles.section}>
            <AboutRow label='Developer' value='Manoj Kumar' />
          </View>
        </AppCard>

        <AppCard
          onPress={() => Linking.openURL('https://github.com/ManojMJ17')}
        >
          <View style={styles.section}>
            <AboutRow label='GitHub' value='@ManojMJ17' />
          </View>
        </AppCard>
        {/* <AppCard onPress={() => {}}>
          <View style={styles.section}>
            <AboutRow label='Open Source Licenses' value='View' />
          </View>
        </AppCard> */}

        <View style={styles.footer}>
          <AppText variant='caption' color={Colors.dark.textSecondary}>
            Made with ❤️ by Manoj Kumar
          </AppText>
        </View>
      </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Theme.spacing.md,
  },

  hero: {
    alignItems: 'center',
    paddingVertical: Theme.spacing['3xl'],
  },

  logo: {
    width: 110,
    height: 110,
    borderRadius: 28,
    marginBottom: Theme.spacing.lg,
  },

  title: {
    marginBottom: Theme.spacing.xs,
  },

  section: {
    gap: Theme.spacing.md,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  footer: {
    alignItems: 'center',
    paddingVertical: Theme.spacing.xl,
  },
});
