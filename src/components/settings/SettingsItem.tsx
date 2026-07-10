import { ChevronRight, LucideIcon } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';
import { Theme } from '@/constants/theme';
import { useTheme } from '@/theme/useTheme';

export interface SettingsItemProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  onPress: () => void;
}

export function SettingsItem({
  title,
  subtitle,
  icon: IconComponent,
  onPress,
}: SettingsItemProps) {
  const { colors } = useTheme();

  return (
    <AppCard onPress={onPress} contentStyle={styles.itemContent}>
      <View
        style={[styles.leading, { backgroundColor: colors.surfaceVariant }]}
      >
        <IconComponent size={22} color={colors.primary} />
      </View>

      <View style={styles.textContainer}>
        <AppText variant='body'>{title}</AppText>

        {subtitle ? (
          <AppText
            variant='caption'
            color={colors.textSecondary}
            style={styles.subtitle}
          >
            {subtitle}
          </AppText>
        ) : null}
      </View>

      <ChevronRight
        size={22}
        color={colors.textSecondary}
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
