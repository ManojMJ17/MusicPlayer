import { PropsWithChildren, ReactNode } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { Screen } from '@/components/common/Screen';
import { AppText } from '@/components/ui/AppText';
import { Colors } from '@/constants/colors';
import { Theme } from '@/constants/theme';

interface PageLayoutProps extends PropsWithChildren {
  title: string;
  subtitle?: string;

  scrollable?: boolean;

  refreshing?: boolean;
  onRefresh?: () => void;

  headerRight?: ReactNode;

  contentStyle?: StyleProp<ViewStyle>;
}

export function PageLayout({
  children,
  title,
  subtitle,

  scrollable = false,

  refreshing = false,
  onRefresh,

  headerRight,

  contentStyle,
}: PageLayoutProps) {
  const content = (
    <>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <AppText variant='headline'>{title}</AppText>

          {subtitle ? (
            <AppText
              variant='bodySmall'
              color={Colors.dark.textSecondary}
              style={styles.subtitle}
            >
              {subtitle}
            </AppText>
          ) : null}
        </View>

        {headerRight}
      </View>

      <View style={[styles.content, contentStyle]}>{children}</View>
    </>
  );

  return (
    <Screen>
      {scrollable ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={Colors.dark.primary}
              />
            ) : undefined
          }
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: Theme.spacing.lg,
    paddingBottom: Theme.spacing.lg,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  titleContainer: {
    flex: 1,
  },

  subtitle: {
    marginTop: Theme.spacing.xs,
  },

  content: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: Theme.spacing['4xl'],
  },
});
