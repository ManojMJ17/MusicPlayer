import { Stack } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '../songs',
};

export default function LibraryLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
