import { MiniPlayer } from '@/components/music/MiniPlayer';
import { useAudio } from '@/hooks/useAudio';
import { useTheme } from '@/theme/useTheme';
import { Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  useAudio();
  const { colors } = useTheme();

  const pathname = usePathname();

  const hideMiniPlayer =
    pathname === '/player' ||
    pathname === '/about' ||
    pathname.startsWith('/library/album') ||
    pathname.startsWith('/library/artist') ||
    pathname.startsWith('/library/playlist');

  const showMiniPlayer = !hideMiniPlayer;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style='light' />

      <View style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: colors.background,
            },
            headerTintColor: colors.text,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            contentStyle: {
              backgroundColor: colors.background,
            },
          }}
        >
          <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
          <Stack.Screen
            name='player'
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom',
              headerShown: false,
              gestureEnabled: true,
            }}
          />
        </Stack>

        {showMiniPlayer && <MiniPlayer />}
      </View>
    </GestureHandlerRootView>
  );
}


