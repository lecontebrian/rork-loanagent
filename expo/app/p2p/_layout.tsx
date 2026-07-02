import { Stack } from 'expo-router';

export default function P2PLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="portfolio" />
      <Stack.Screen name="withdraw" options={{ presentation: 'modal' }} />
      <Stack.Screen name="add-funds" options={{ presentation: 'modal' }} />
      <Stack.Screen name="send" options={{ presentation: 'modal' }} />
      <Stack.Screen name="request-loan" />
    </Stack>
  );
}
