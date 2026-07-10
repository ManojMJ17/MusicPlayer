import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { PlaylistIconPicker } from './PlaylistIconPicker';

import { AppButton } from '@/components/ui/AppButton';
import { AppText } from '@/components/ui/AppText';
import { getPlaylistIcon } from '@/constants/playlist-icons';
import { Theme } from '@/constants/theme';
import { useTheme } from '@/theme/useTheme';

interface PlaylistEditorDialogProps {
  visible: boolean;
  title: string;
  placeholder: string;
  confirmLabel?: string;
  initialValue?: string;
  initialIconId?: string;
  onClose: () => void;
  onSubmit: (name: string, iconId: string) => void;
}

export function PlaylistEditorDialog({
  visible,
  title,
  placeholder,
  confirmLabel = 'Save',
  initialValue = '',
  initialIconId = 'music',
  onClose,
  onSubmit,
}: PlaylistEditorDialogProps) {
  const { colors } = useTheme();
  const [value, setValue] = useState(initialValue);
  const [selectedIcon, setSelectedIcon] = useState(initialIconId);
  const [prevVisible, setPrevVisible] = useState(visible);

  if (visible !== prevVisible) {
    setPrevVisible(visible);
    if (visible) {
      setValue(initialValue);
      setSelectedIcon(initialIconId || 'music');
    }
  }

  const handleClose = () => {
    setValue('');
    setSelectedIcon('music');
    onClose();
  };

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit(value.trim(), selectedIcon);
      setValue('');
      setSelectedIcon('music');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      onRequestClose={handleClose}
    >
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Pressable
          onPress={() => {}}
          style={[
            styles.dialog,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <AppText variant='title' style={[styles.title, { color: colors.text }]}>
            {title}
          </AppText>

          <View style={styles.previewSection}>
            <View
              style={[
                styles.previewContainer,
                {
                  backgroundColor: colors.surfaceVariant,
                  borderColor: colors.border,
                },
              ]}
            >
              {React.createElement(getPlaylistIcon(selectedIcon), {
                size: 36,
                color: colors.primary,
              })}
            </View>
          </View>

          <TextInput
            placeholder={placeholder}
            placeholderTextColor={colors.textSecondary}
            value={value}
            onChangeText={setValue}
            autoFocus
            style={[
              styles.input,
              {
                backgroundColor: colors.surfaceVariant,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
          />

          <AppText
            variant='caption'
            color={colors.textSecondary}
            style={styles.pickerLabel}
          >
            CHOOSE ICON
          </AppText>

          <PlaylistIconPicker
            selectedIconId={selectedIcon}
            onSelect={setSelectedIcon}
          />

          <View style={styles.buttons}>
            <Pressable style={styles.cancelButton} onPress={handleClose}>
              <AppText color={colors.textSecondary} style={styles.cancelText}>
                Cancel
              </AppText>
            </Pressable>
            <View style={styles.submitWrapper}>
              <AppButton
                title={confirmLabel}
                onPress={handleSubmit}
                disabled={!value.trim()}
              />
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.xl,
  },

  dialog: {
    width: '100%',
    maxWidth: 340,
    borderRadius: Theme.radius.xl,
    borderWidth: 1,
    padding: Theme.spacing.xl,
    elevation: Theme.elevation.lg,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Theme.spacing.md,
  },

  previewSection: {
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
  },

  previewContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  input: {
    height: 52,
    borderRadius: Theme.radius.lg,
    borderWidth: 1.5,
    paddingHorizontal: Theme.spacing.md,
    fontSize: 16,
    marginBottom: Theme.spacing.md,
  },

  pickerLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: Theme.spacing.xs,
  },

  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: Theme.spacing.md,
    marginTop: Theme.spacing.md,
  },

  cancelButton: {
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
  },

  cancelText: {
    fontWeight: '600',
  },

  submitWrapper: {
    width: 120,
  },
});
