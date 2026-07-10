import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Theme } from '@/constants/theme';
import { useTheme } from '@/theme/useTheme';

export interface ActionSheetOption {
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap | keyof typeof Ionicons.glyphMap;
  iconType?: 'material' | 'ionicons';
  onPress: () => void;
  destructive?: boolean;
}

interface ActionSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  headerImage?: string | number | null | any;
  options?: ActionSheetOption[];
  children?: React.ReactNode;
}

export function ActionSheet({
  visible,
  onClose,
  title,
  subtitle,
  headerImage,
  options,
  children,
}: ActionSheetProps) {
  const { colors } = useTheme();

  const renderArtwork = () => {
    if (headerImage === undefined) return null;
    if (!headerImage) {
      return (
        <View style={[styles.artworkContainer, { backgroundColor: colors.surfaceVariant }]}>
          <MaterialIcons name='music-note' size={24} color={colors.primary} />
        </View>
      );
    }
    return (
      <Image
        source={typeof headerImage === 'string' ? { uri: headerImage } : headerImage}
        style={styles.artwork}
      />
    );
  };

  return (
    <Modal
      visible={visible}
      animationType='slide'
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.flexSpacer} />
        <Pressable
          onPress={() => {}}
          style={[
            styles.sheet,
            {
              backgroundColor: colors.surface,
            },
          ]}
        >
          {/* Bottom Sheet Handle */}
          <View style={[styles.handle, { backgroundColor: colors.border }]} />

          {/* Optional Header Section */}
          {(title || subtitle || headerImage !== undefined) && (
            <View style={styles.header}>
              {renderArtwork()}
              <View style={styles.headerText}>
                {title && (
                  <AppText variant='body' style={[styles.title, { color: colors.text }]} numberOfLines={1}>
                    {title}
                  </AppText>
                )}
                {subtitle && (
                  <AppText variant='caption' color={colors.textSecondary} numberOfLines={1}>
                    {subtitle}
                  </AppText>
                )}
              </View>
            </View>
          )}

          {/* Optional Options List */}
          {options && options.length > 0 && (
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.scrollArea}
              contentContainerStyle={styles.scrollContent}
            >
              {options.map((option, index) => {
                const IconComponent =
                  option.iconType === 'ionicons' ? Ionicons : MaterialIcons;
                const tintColor = option.destructive ? '#ff453a' : colors.icon;

                return (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.7}
                    style={styles.optionRow}
                    onPress={option.onPress}
                  >
                    <View style={styles.iconWrapper}>
                      <IconComponent
                        name={option.icon as any}
                        size={22}
                        color={tintColor}
                      />
                    </View>
                    <AppText
                      variant='body'
                      color={option.destructive ? '#ff453a' : colors.text}
                      style={styles.optionLabel}
                    >
                      {option.label}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}

          {/* Custom Children Support */}
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  flexSpacer: {
    flex: 1,
  },

  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.xl,
    paddingBottom: Theme.spacing['4xl'],
    maxHeight: '80%',
  },

  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Theme.spacing.lg,
    opacity: 0.5,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
    paddingBottom: Theme.spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },

  artworkContainer: {
    width: 48,
    height: 48,
    borderRadius: Theme.radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  },

  artwork: {
    width: 48,
    height: 48,
    borderRadius: Theme.radius.sm,
    marginRight: Theme.spacing.md,
  },

  headerText: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 2,
  },

  scrollArea: {
    maxHeight: 380,
  },

  scrollContent: {
    paddingVertical: Theme.spacing.xs,
  },

  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
  },

  iconWrapper: {
    width: 40,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  optionLabel: {
    marginLeft: Theme.spacing.xs,
    fontSize: 16,
    fontWeight: '500',
  },
});
