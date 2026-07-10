import { ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { useTheme } from '@/theme/useTheme';

interface DataStateProps {
  loading: boolean;
  error: string | null;
  isEmpty: boolean;

  children: ReactNode;
  empty: ReactNode;

  loadingComponent?: ReactNode;
  errorComponent?: ReactNode;
}

export function DataState({
  loading,
  error,
  isEmpty,
  children,
  empty,
  loadingComponent,
  errorComponent,
}: DataStateProps) {
  const { colors } = useTheme();

  if (loading) {
    if (loadingComponent) {
      return <>{loadingComponent}</>;
    }

    return (
      <View style={styles.center}>
        <ActivityIndicator size='large' color={colors.primary} />

        <AppText style={styles.loadingText}>Loading...</AppText>
      </View>
    );
  }

  if (error) {
    if (errorComponent) {
      return <>{errorComponent}</>;
    }

    return (
      <View style={styles.center}>
        <AppText variant='title'>Something went wrong</AppText>

        <AppText
          variant='bodySmall'
          color={colors.textSecondary}
          align='center'
        >
          {error}
        </AppText>
      </View>
    );
  }

  if (isEmpty) {
    return <>{empty}</>;
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  loadingText: {
    marginTop: 12,
  },
});
