import { ArrowLeft, X } from 'lucide-react-native';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Theme } from '@/constants/theme';
import { useTheme } from '@/theme/useTheme';

interface SearchBarProps {
  value: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
  onClose: () => void;
}

export default function SearchBar({
  value,
  placeholder = 'Search...',
  onChangeText,
  onClose,
}: SearchBarProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: colors.border, // or your outline color
          backgroundColor: colors.surface,
        },
      ]}
    >
      <Pressable onPress={onClose}>
        <ArrowLeft size={24} color={colors.text} />
      </Pressable>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        style={[
          styles.input,
          { marginHorizontal: Theme.spacing.md, color: colors.text },
        ]}
        autoFocus
        returnKeyType='search'
      />

      {value.length > 0 && (
        <Pressable onPress={() => onChangeText('')}>
          <X size={22} color={colors.textSecondary} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
    paddingHorizontal: 2,
  },

  container: {
    flexDirection: 'row',
    alignItems: 'center',

    height: 52,

    paddingHorizontal: Theme.spacing.md,

    borderWidth: 1,

    borderRadius: Theme.radius.lg,

    marginTop: 10,
    marginBottom: 10,
  },
});
