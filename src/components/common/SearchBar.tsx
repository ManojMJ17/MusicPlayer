import { Colors } from '@/constants/colors';
import { Theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

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
  return (
    <View style={styles.container}>
      <Pressable onPress={onClose}>
        <Ionicons name='arrow-back' size={24} color={Colors.dark.text} />
      </Pressable>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.dark.textSecondary}
        style={[styles.input, { marginHorizontal: Theme.spacing.md }]}
        autoFocus
        returnKeyType='search'
      />

      {value.length > 0 && (
        <Pressable onPress={() => onChangeText('')}>
          <Ionicons name='close' size={22} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    color: Colors.dark.text,
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
    borderColor: Colors.dark.border, // or your outline color

    borderRadius: Theme.radius.lg,

    backgroundColor: Colors.dark.surface,

    marginTop: 10,
    marginBottom: 10,
  },
});
