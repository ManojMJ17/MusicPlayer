import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { Theme } from '@/constants/theme';
import { useTheme } from '@/theme/useTheme';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  backgroundColor?: string;
  textColor?: string;
}

export function AppButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  backgroundColor,
  textColor,
}: AppButtonProps) {
  const isDisabled = disabled || loading;
  const { colors } = useTheme();
  
  const finalBgColor = backgroundColor || colors.primary;
  const finalTextColor = textColor || colors.background;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        { backgroundColor: finalBgColor },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={finalTextColor} />
      ) : (
        <Text style={[styles.text, { color: finalTextColor }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: Theme.radius.lg,

    alignItems: 'center',
    justifyContent: 'center',
  },

  pressed: {
    opacity: 0.85,
  },

  disabled: {
    opacity: 0.5,
  },

  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
