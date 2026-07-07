import { MiniPlayer } from '@/components/music/MiniPlayer';
import { useAudio } from '@/hooks/useAudio';
import { Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  // Mount the audio engine bridge for the entire app lifetime.
  useAudio();

  const pathname = usePathname();

  const showMiniPlayer =
    pathname.startsWith('/(tabs)') ||
    ['/songs', '/albums', '/artists', '/playlists', '/settings'].includes(pathname);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style='light' />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="player"
          options={{
            presentation: "modal",
            animation: "slide_from_bottom",
            headerShown: false,
            gestureEnabled: true,
          }}
        />
      </Stack>

      {showMiniPlayer && <MiniPlayer />}
    </GestureHandlerRootView>
  );
}
