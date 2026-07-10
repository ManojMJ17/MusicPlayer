import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppText } from '@/components/ui/AppText';
import { Theme } from '@/constants/theme';
import { useTheme } from '@/theme/useTheme';

interface InputDialogProps {
  visible: boolean;
  title: string;
  placeholder: string;
  initialValue?: string;
  onClose: () => void;
  onSubmit: (value: string) => void;
}

export function InputDialog({
  visible,
  title,
  placeholder,
  initialValue = '',
  onClose,
  onSubmit,
}: InputDialogProps) {
  const { colors } = useTheme();
  const [value, setValue] = useState(initialValue);

  const handleClose = () => {
    setValue('');
    onClose();
  };

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit(value.trim());
      setValue('');
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
          <AppText variant='title' style={styles.title}>
            {title}
          </AppText>

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

          <View style={styles.buttons}>
            <Pressable style={styles.cancelButton} onPress={handleClose}>
              <AppText color={colors.textSecondary} style={styles.cancelText}>
                Cancel
              </AppText>
            </Pressable>
            <View style={styles.submitWrapper}>
              <AppButton
                title='Create'
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

  input: {
    height: 52,
    borderRadius: Theme.radius.lg,
    borderWidth: 1.5,
    paddingHorizontal: Theme.spacing.md,
    fontSize: 16,
    marginBottom: Theme.spacing.lg,
  },

  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: Theme.spacing.md,
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
