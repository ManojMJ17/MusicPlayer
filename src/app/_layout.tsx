import { MiniPlayer } from '@/components/music/MiniPlayer';
import { Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  const pathname = usePathname();

  const showMiniPlayer = pathname !== '/player';
  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style='light' />
      <View style={styles.content}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </View>
      {showMiniPlayer && <MiniPlayer />}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
  },
});
