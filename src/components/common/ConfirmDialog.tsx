import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppText } from '@/components/ui/AppText';
import { Theme } from '@/constants/theme';
import { useTheme } from '@/theme/useTheme';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({
  visible,
  title,
  description,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  isDestructive = true,
  onClose,
  onConfirm,
}: ConfirmDialogProps) {
  const { colors } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
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
          <AppText
            variant='body'
            color={colors.textSecondary}
            style={styles.description}
          >
            {description}
          </AppText>

          <View style={styles.buttons}>
            <Pressable style={styles.cancelButton} onPress={onClose}>
              <AppText color={colors.textSecondary} style={styles.cancelText}>
                {cancelLabel}
              </AppText>
            </Pressable>
            <View style={styles.confirmWrapper}>
              <AppButton
                title={confirmLabel}
                onPress={() => {
                  onConfirm();
                  onClose();
                }}
                backgroundColor={isDestructive ? colors.error : colors.primary}
                textColor={isDestructive ? colors.text : colors.background}
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
    maxWidth: 320,
    borderRadius: Theme.radius.xl,
    borderWidth: 1,
    padding: Theme.spacing.xl,
    elevation: Theme.elevation.lg,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Theme.spacing.sm,
  },

  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: Theme.spacing.xl,
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

  confirmWrapper: {
    width: 110,
  },
});
