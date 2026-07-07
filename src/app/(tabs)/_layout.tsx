import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { Colors } from '@/constants/colors';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: Colors.dark.primary,
        tabBarInactiveTintColor: Colors.dark.textSecondary,

        tabBarStyle: {
          backgroundColor: Colors.dark.surface,
          borderTopColor: Colors.dark.border,
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
          backgroundColor: Colors.dark.background,
        },
      }}
    >
      <Tabs.Screen
        name='songs'
        options={{
          title: 'Songs',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name='library-music' color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name='albums'
        options={{
          title: 'Albums',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name='album' color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name='artists'
        options={{
          title: 'Artists',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name='person' color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name='playlists'
        options={{
          title: 'Playlists',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name='queue-music' color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name='settings'
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name='settings' color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
