import { LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet } from 'react-native';

import { Theme } from '@/constants/theme';
import { useTheme } from '@/theme/useTheme';

interface IconButtonProps {
  icon: LucideIcon;
  onPress: () => void;
  size?: number;
}

export function IconButton({
  icon: Icon,
  onPress,
  size = 22,
}: IconButtonProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <Icon size={size} color={colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Theme.spacing.sm,
    borderRadius: Theme.radius.full,
  },

  pressed: {
    opacity: 0.7,
  },
});
