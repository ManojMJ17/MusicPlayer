import { MaterialIcons } from '@expo/vector-icons';
import { Modal, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Theme } from '@/constants/theme';
import { useThemeStore } from '@/store/theme.store';

import { themeList } from './themes';
import { useTheme } from './useTheme';

interface ThemePickerProps {
  visible: boolean;
  onClose: () => void;
}

export function ThemePicker({ visible, onClose }: ThemePickerProps) {
  const { colors, id } = useTheme();

  const setTheme = useThemeStore((state) => state.setTheme);

  const getThemeSubtitle = (themeId: string) => {
    switch (themeId) {
      case 'dark':
        return 'Cyber-neon blue & lavender';
      case 'amoled':
        return 'Sleek pitch-black minimalism';
      case 'ocean':
        return 'Warm violet & sunset orange';
      case 'forest':
        return 'Earthy moss & mint green';
      case 'gruvbox':
        return 'Warm retro & orange accents';
      default:
        return '';
    }
  };

  return (
    <Modal
      visible={visible}
      animationType='slide'
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          onPress={() => {}}
          style={[
            styles.sheet,
            {
              backgroundColor: colors.surface,
            },
          ]}
        >
          {/* Bottom Sheet Drag Handle */}
          <View style={[styles.handle, { backgroundColor: colors.border }]} />

          <AppText variant='title' style={styles.title}>
            Choose Theme
          </AppText>

          <ScrollView
            style={styles.scrollArea}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {themeList.map((theme) => {
              const selected = theme.id === id;

              return (
                <TouchableOpacity
                  key={theme.id}
                  activeOpacity={0.85}
                  onPress={async () => {
                    await setTheme(theme.id);
                    onClose();
                  }}
                  style={[
                    styles.card,
                    {
                      backgroundColor: theme.colors.surface,
                      borderColor: selected ? theme.colors.primary : theme.colors.border,
                      borderWidth: selected ? 2 : 1.5,
                      shadowColor: selected ? theme.colors.primary : 'transparent',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: selected ? 0.3 : 0,
                      shadowRadius: selected ? 6 : 0,
                      elevation: selected ? 4 : 0,
                    },
                  ]}
                >
                  {/* Card Header: Title & Checkbox */}
                  <View style={styles.cardHeader}>
                    <View style={styles.headerText}>
                      <AppText
                        variant='body'
                        style={[styles.cardTitle, { color: theme.colors.text }]}
                      >
                        {theme.displayName}
                      </AppText>
                      <AppText
                        variant='caption'
                        style={[styles.cardSubtitle, { color: theme.colors.textSecondary }]}
                      >
                        {getThemeSubtitle(theme.id)}
                      </AppText>
                    </View>

                    <View
                      style={[
                        styles.checkbox,
                        {
                          borderColor: selected ? theme.colors.primary : theme.colors.border,
                          backgroundColor: selected ? theme.colors.primary : 'transparent',
                        }
                      ]}
                    >
                      {selected && (
                        <MaterialIcons
                          name='check'
                          size={14}
                          color={theme.colors.background}
                        />
                      )}
                    </View>
                  </View>

                  {/* Mock Player UI Preview */}
                  <View
                    style={[
                      styles.previewContainer,
                      {
                        backgroundColor: theme.colors.background,
                        borderColor: theme.colors.border,
                      }
                    ]}
                  >
                    {/* Mini Album Art */}
                    <View
                      style={[
                        styles.miniAlbumArt,
                        { backgroundColor: theme.colors.surfaceVariant }
                      ]}
                    >
                      <MaterialIcons
                        name='music-note'
                        size={16}
                        color={theme.colors.primary}
                      />
                    </View>

                    {/* Mini Playback Track Info */}
                    <View style={styles.miniInfo}>
                      <View style={[styles.miniBarTitle, { backgroundColor: theme.colors.text }]} />
                      <View style={[styles.miniBarArtist, { backgroundColor: theme.colors.textSecondary }]} />

                      {/* Miniature Progress Bar */}
                      <View style={styles.miniProgressContainer}>
                        <View style={[styles.miniProgressTrack, { backgroundColor: theme.colors.border }]}>
                          <View
                            style={[
                              styles.miniProgressFill,
                              {
                                backgroundColor: theme.colors.primary,
                                width: selected ? '65%' : '40%'
                              }
                            ]}
                          />
                        </View>
                      </View>
                    </View>

                    {/* Color Palette Indicators */}
                    <View style={styles.colorPills}>
                      <View style={[styles.pill, { backgroundColor: theme.colors.primary }]} />
                      <View style={[styles.pill, { backgroundColor: theme.colors.secondary }]} />
                      <View style={[styles.pill, { backgroundColor: theme.colors.surfaceVariant }]} />
                    </View>

                    {/* Mini Play Button */}
                    <View style={styles.miniControls}>
                      <MaterialIcons
                        name={selected ? 'pause' : 'play-arrow'}
                        size={18}
                        color={theme.colors.primary}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
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

  sheet: {
    paddingHorizontal: Theme.spacing.xl,
    paddingTop: Theme.spacing.md,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingBottom: Theme.spacing['4xl'],
    maxHeight: '85%',
  },

  handle: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: Theme.spacing.lg,
    opacity: 0.6,
  },

  title: {
    marginBottom: Theme.spacing.lg,
    fontWeight: '700',
    fontSize: 22,
    textAlign: 'center',
  },

  scrollArea: {
    width: '100%',
  },

  scrollContent: {
    paddingBottom: Theme.spacing.md,
  },

  card: {
    borderRadius: Theme.radius.xl,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
    borderWidth: 1.5,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.md,
  },

  headerText: {
    flex: 1,
    marginRight: Theme.spacing.md,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },

  cardSubtitle: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },

  previewContainer: {
    borderRadius: Theme.radius.md,
    padding: Theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },

  miniAlbumArt: {
    width: 32,
    height: 32,
    borderRadius: Theme.radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },

  miniInfo: {
    flex: 1,
    marginLeft: Theme.spacing.md,
    justifyContent: 'center',
  },

  miniBarTitle: {
    height: 6,
    width: 80,
    borderRadius: 3,
    opacity: 0.8,
  },

  miniBarArtist: {
    height: 4,
    width: 50,
    borderRadius: 2,
    marginTop: 4,
    opacity: 0.5,
  },

  miniProgressContainer: {
    marginTop: Theme.spacing.sm,
    width: '90%',
  },

  miniProgressTrack: {
    height: 3,
    borderRadius: 1.5,
    width: '100%',
    overflow: 'hidden',
  },

  miniProgressFill: {
    height: '100%',
    borderRadius: 1.5,
  },

  colorPills: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Theme.spacing.sm,
  },

  pill: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 4,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.1)',
  },

  miniControls: {
    marginLeft: Theme.spacing.sm,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
