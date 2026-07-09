import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';
import { Colors } from '@/constants/colors';
import { Theme } from '@/constants/theme';

export interface SettingsItemProps {
  title: string;
  subtitle?: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
}

export function SettingsItem({
  title,
  subtitle,
  icon,
  onPress,
}: SettingsItemProps) {
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

const styles = StyleSheet.create({
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
