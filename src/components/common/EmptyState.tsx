import { MaterialIcons } from '@expo/vector-icons';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Colors } from '@/constants/colors';
import { Theme } from '@/constants/theme';

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
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconContainer}>
        <MaterialIcons
          name={icon}
          size={48}
          color={Colors.dark.textSecondary}
        />
      </View>

      <AppText variant='title' align='center'>
        {title}
      </AppText>

      {description ? (
        <AppText
          variant='bodySmall'
          color={Colors.dark.textSecondary}
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
    backgroundColor: Colors.dark.surfaceVariant,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Theme.spacing.xl,
  },

  description: {
    marginTop: Theme.spacing.sm,
    maxWidth: 280,
  },
});
