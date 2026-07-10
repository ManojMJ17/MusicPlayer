import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { PLAYLIST_ICONS } from '@/constants/playlist-icons';
import { Theme } from '@/constants/theme';
import { useTheme } from '@/theme/useTheme';

interface PlaylistIconPickerProps {
  selectedIconId: string;
  onSelect: (iconId: string) => void;
}

export function PlaylistIconPicker({
  selectedIconId,
  onSelect,
}: PlaylistIconPickerProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.grid}>
      {PLAYLIST_ICONS.map((item) => {
        const IconComponent = item.icon;
        const isSelected = item.id === selectedIconId;
        return (
          <Pressable
            key={item.id}
            onPress={() => onSelect(item.id)}
            android_ripple={{ color: 'rgba(255,255,255,0.1)', borderless: true }}
            style={[
              styles.iconCard,
              {
                backgroundColor: isSelected ? colors.primary : colors.surfaceVariant,
                borderColor: isSelected ? colors.primary : colors.border,
              },
            ]}
          >
            <IconComponent
              size={22}
              color={isSelected ? colors.background : colors.text}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Theme.spacing.md,
    marginVertical: Theme.spacing.md,
  },

  iconCard: {
    width: 48,
    height: 48,
    borderRadius: Theme.radius.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
