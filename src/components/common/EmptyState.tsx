import { MaterialIcons } from '@expo/vector-icons';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Theme } from '@/constants/theme';
import { useTheme } from '@/theme/useTheme';

interface EmptyStateProps {
  icon?: keyof typeof MaterialIcons.glyphMap;
  title: string;
  description?: string;
  style?: StyleProp<ViewStyle>;
}

export function EmptyState({
  icon = 'library-music',
  title,
  description,
  style,
}: EmptyStateProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: colors.surfaceVariant,
            borderColor: colors.border,
          },
        ]}
      >
        <MaterialIcons name={icon} size={48} color={colors.textSecondary} />
      </View>

      <AppText variant='title' align='center'>
        {title}
      </AppText>

      {description ? (
        <AppText
          variant='bodySmall'
          color={colors.textSecondary}
          align='center'
          style={styles.description}
        >
          {description}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Theme.spacing['3xl'],
  },

  iconContainer: {
    width: 88,
    height: 88,
    borderRadius: Theme.radius.full,

    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Theme.spacing.xl,
  },

  description: {
    marginTop: Theme.spacing.sm,
    maxWidth: 280,
  },
});
