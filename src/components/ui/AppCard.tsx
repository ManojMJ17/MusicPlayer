import { PropsWithChildren } from 'react';
import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { Theme } from '@/constants/theme';
import { useTheme } from '@/theme/useTheme';

interface AppCardProps extends PropsWithChildren {
  onPress?: PressableProps['onPress'];
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

export function AppCard({
  children,
  onPress,
  style,
  contentStyle,
  disabled = false,
}: AppCardProps) {
  const { colors } = useTheme();

  const content = (
    <View style={[styles.content, contentStyle]}>{children}</View>
  );

  if (!onPress) {
    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
          style,
        ]}
      >
        {content}
      </View>
    );
  }

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      android_ripple={{
        color: 'rgba(255,255,255,0.08)',
        borderless: false,
      }}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Theme.radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },

  content: {
    padding: Theme.spacing.sm,
  },

  pressed: {
    opacity: Theme.opacity.pressed,
  },

  disabled: {
    opacity: Theme.opacity.disabled,
  },
});
