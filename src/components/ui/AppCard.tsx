import { PropsWithChildren } from 'react';
import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { Colors } from '@/constants/colors';
import { Theme } from '@/constants/theme';

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
  const content = (
    <View style={[styles.content, contentStyle]}>{children}</View>
  );

  if (!onPress) {
    return <View style={[styles.card, style]}>{content}</View>;
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
    backgroundColor: Colors.dark.surface,
    borderRadius: Theme.radius.lg,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    overflow: 'hidden',
  },

  content: {
    padding: Theme.spacing.lg,
  },

  pressed: {
    opacity: Theme.opacity.pressed,
  },

  disabled: {
    opacity: Theme.opacity.disabled,
  },
});
