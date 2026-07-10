import { useTheme } from '@/theme/useTheme';
import { Tabs } from 'expo-router';
import { Music, Disc, Mic, ListMusic, Heart, Settings } from 'lucide-react-native';

/**
 * Custom tab bar that renders the MiniPlayer directly above the tab bar.
 * This achieves the Spotify-style layout:
 *   Content → MiniPlayer → Tab Bar
 */

export default function TabsLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,

        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 64,
          paddingTop: 8,
          paddingBottom: 8,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },

        sceneStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Tabs.Screen
        name='songs'
        options={{
          title: 'Songs',
          tabBarIcon: ({ color, size }) => (
            <Music color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name='albums'
        options={{
          title: 'Albums',
          tabBarIcon: ({ color, size }) => (
            <Disc color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name='artists'
        options={{
          title: 'Artists',
          tabBarIcon: ({ color, size }) => (
            <Mic color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name='playlists'
        options={{
          title: 'Playlists',
          tabBarIcon: ({ color, size }) => (
            <ListMusic color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name='favorites'
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color, size }) => (
            <Heart color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name='settings'
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Settings color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
