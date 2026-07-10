import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppText } from '@/components/ui/AppText';
import { Theme } from '@/constants/theme';
import { useTheme } from '@/theme/useTheme';

interface DetailRow {
  label: string;
  value: string;
}

interface DetailsModalProps {
  visible: boolean;
  title: string;
  details: DetailRow[];
  onClose: () => void;
}

export function DetailsModal({
  visible,
  title,
  details,
  onClose,
}: DetailsModalProps) {
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

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
          >
            {details.map((row, index) => (
              <View
                key={index}
                style={[
                  styles.row,
                  { borderBottomColor: colors.border },
                  index === details.length - 1 && styles.noBorder,
                ]}
              >
                <AppText
                  variant='caption'
                  color={colors.textSecondary}
                  style={styles.label}
                >
                  {row.label.toUpperCase()}
                </AppText>
                <AppText
                  variant='body'
                  style={[styles.value, { color: colors.text }]}
                  selectable
                >
                  {row.value}
                </AppText>
              </View>
            ))}
          </ScrollView>

          <View style={styles.buttonWrapper}>
            <AppButton title='Close' onPress={onClose} />
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
    maxHeight: '70%',
    borderRadius: Theme.radius.xl,
    borderWidth: 1,
    padding: Theme.spacing.xl,
    elevation: Theme.elevation.lg,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: Theme.spacing.lg,
  },

  scrollArea: {
    marginBottom: Theme.spacing.lg,
  },

  scrollContent: {
    gap: Theme.spacing.md,
  },

  row: {
    paddingBottom: Theme.spacing.sm,
    borderBottomWidth: 0.5,
  },

  noBorder: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },

  label: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 4,
  },

  value: {
    fontSize: 15,
    fontWeight: '500',
  },

  buttonWrapper: {
    width: '100%',
  },
});
