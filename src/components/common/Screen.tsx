import { Colors } from '@/constants/colors';
import { Theme } from '@/constants/theme';
import { PropsWithChildren } from 'react';
import { StatusBar, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenProps extends PropsWithChildren {
  style?: ViewStyle;
}

export function Screen({ children, style }: ScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle='light-content'
        backgroundColor={Colors.dark.background}
      />

      <View style={[styles.container, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },

  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    paddingHorizontal: Theme.spacing.lg,
  },
});
